import clientPromise from "../../../lib/mongodb";
import type { NextApiResponse } from "next";

export default async function handler(res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("AiWizard");
    await db.collection("chats").deleteMany({});
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: "An error occured deleting all chats" });
  }
}
