// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "../../../lib/mongodb";
// import { ObjectId } from "mongodb";

// export default async function handler(req: any, res: any) {
//   try {
//     const session = await getSession(req, res);
//     const user = session?.user;
//     const client = await clientPromise;
//     const db = client.db("AiWizard");

//     const { chatId, title } = req.body;

//     const chat = await db.collection("chats").findOneAndUpdate(
//       {
//         _id: new ObjectId(chatId),
//         userId: user?.sub,
//       },
//       {
//         $set: {
//           title: title,
//         },
//       },
//       {
//         returnDocument: "after",
//       }
//     );

//     res.status(200).json({
//       ...chat,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "An error occured adding message to a chat" });
//   }
// }
