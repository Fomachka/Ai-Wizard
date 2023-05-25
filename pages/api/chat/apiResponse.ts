import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: {
  json: () => PromiseLike<{ message: string }> | { message: string };
}) {
  try {
    const { message } = await req.json();
    const infoAboutAI = {
      role: "system",
      content:
        "This is Wizard AI prompt. I can answer most of your questions with magic. I was created by Man Khi Kim a front-end wizard. Write every response in markdown",
    };
    const stream = await OpenAIEdgeStream("https://api.openai.com/v1/chat/completions", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [infoAboutAI, { content: message, role: "user" }],
        stream: true,
      }),
    });

    return new Response(stream);
  } catch (error) {
    console.log("ERROR IN SENDMESSAGE: ", error);
  }
}
