import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("AiWizard");
    const { chatId } = req.body;

    await db.collection("chats").deleteOne({
      _id: new ObjectId(chatId),
    });

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: "An error occured deleting a single chat" });
  }
}
