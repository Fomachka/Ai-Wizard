import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: any) {
  try {
    const { message, chatId: chatIdParam } = await req.json();
    let chatId = chatIdParam;

    if (!message || typeof message !== "string" || message.length > 300) {
      return new Response(
        {
          message: "Enter a message that is 300 characters or less",
        },
        {
          status: 422,
        }
      );
    }

    const infoAboutAI = {
      role: "system",
      content:
        "This is Wizard AI prompt. I can answer most of your questions with magic. I was created by Man Khi Kim a front-end wizard. Write every response in markdown",
    };

    let newChatId: string | null;
    let chatMessages = [];

    if (chatId) {
      const response = await fetch(
        `${req.headers.get("origin")}/api/database/updateChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            chatId,
            role: "user",
            content: message,
          }),
        }
      );
      const data = await response.json();
      chatMessages = data.chat.messages || [];
    } else {
      const response = await fetch(
        `${req.headers.get("origin")}/api/database/createChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({ message: message }),
        }
      );
      const data = await response.json();
      chatMessages = data.messages || [];
      chatId = data._id;
      newChatId = data._id;
    }

    const chatHistory = [];
    chatMessages.reverse();
    let usedTokens = 0;
    for (let chatMessage of chatMessages) {
      const messageTokens = chatMessage.content.length / 4;
      usedTokens = usedTokens + messageTokens;
      if (usedTokens <= 2000) {
        chatHistory.push(chatMessage);
      } else {
        break;
      }
    }

    chatHistory.reverse();

    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [infoAboutAI, ...chatHistory],
          stream: true,
        }),
      },
      {
        onBeforeStream: ({ emit }) => {
          if (newChatId) {
            emit(chatId, "newChatId");
          }
        },
        onAfterStream: async ({ fullContent }) => {
          await fetch(`${req.headers.get("origin")}/api/database/updateChat`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              cookie: req.headers.get("cookie"),
            },
            body: JSON.stringify({
              chatId: chatId,
              role: "assistant",
              content: fullContent,
            }),
          });
        },
      }
    );

    return new Response(stream);
  } catch (error) {
    return new Response(
      { message: "AI has failed to answer a question." },
      {
        status: 500,
      }
    );
  }
}
