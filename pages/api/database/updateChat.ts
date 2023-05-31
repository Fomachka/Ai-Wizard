import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../../lib/mongodb";
import { ObjectId, PushOperator } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    const user = session?.user;
    const client = await clientPromise;
    const db = client.db("AiWizard");
    const { chatId, role, content } = req.body;
    let validId;

    try {
      validId = new ObjectId(chatId);
    } catch (error) {
      res.status(422).json({
        message: "Wrong Chat",
      });
      return;
    }

    if (
      !content ||
      typeof content !== "string" ||
      (role === "user" && content.length > 300) ||
      (role === "assistant" && content.length > 100000)
    ) {
      res.status(422).json({
        message: "Enter content that is 300 characters or less",
      });
      return;
    }

    // validate role
    if (role !== "user" && role !== "assistant") {
      res.status(422).json({
        message: "role must be either 'assistant' or 'user'",
      });
      return;
    }

    const chat = await db.collection("chats").findOneAndUpdate(
      {
        _id: validId,
        userId: user?.sub,
      },
      {
        $push: {
          messages: {
            role,
            content,
          },
        } as unknown as PushOperator<Document>,
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({
      chat: {
        ...chat.value,
        _id: chat.value?._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured adding message to a chat" });
  }
}
