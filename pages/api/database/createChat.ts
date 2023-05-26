import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const session = await getSession(req, res);
    const user = session?.user;
    const { message, title } = req.body;
    const newUserMessage = {
      role: "user",
      content: message,
    };

    const client = await clientPromise;
    const db = client.db("AiWizard");
    const chat = await db.collection("chats").insertOne({
      userId: user?.sub,
      messages: [newUserMessage],
      title: message,
    });
    res.status(200).json({
      _id: chat.insertedId.toString(),
      messages: [newUserMessage],
      title: message,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured creating a new chat" });
    console.log("CREATE NEW CHAT ERROR: ", error);
  }
}
