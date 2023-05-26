import Head from "next/head";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid4 } from "uuid";
import MessageBox from "../../components/MessageBox/MessageBox";
import {
  faComments,
  faTrashCan,
  faPaperPlane,
  faEdit,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

interface newMessageProps {
  _id: string;
  role: string;
  content: string;
}

const Chat = ({
  chatId,
  title,
  messages = [],
}: {
  chatId: string | null;
  title: string | null;
  messages: newMessageProps[] | [];
}) => {
  console.log(chatId, title, messages);
  const [messageFromAI, setMessageFromAI] = useState("");
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const [text, setText] = useState("");
  // const [currentTitle, setTitle] = useState<string>("Chat with AI");
  // // const [finalTitle, setFinalTitle] = useState<string>("");
  // const [titleEdit, setTitleEdit] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<newMessageProps[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const ref = useRef<HTMLInputElement>(null);
  const [allMessages, setAllMessages] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUserPrompt([]);
    setNewChatId(null);
  }, [chatId]);

  useEffect(() => {
    if (allMessages && !isLoading) {
      setUserPrompt((prev) => [
        ...prev,
        {
          _id: uuid4(),
          role: "assistant",
          content: allMessages,
        },
      ]);
      setAllMessages("");
    }
  }, [allMessages, isLoading]);

  useEffect(() => {
    if (!isLoading && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, isLoading, router]);

  const handleMessage = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setText(target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setUserPrompt((prev) => {
      const userPrompt = [
        ...prev,
        {
          _id: uuid4(),
          role: "user",
          content: text,
        },
      ];

      return userPrompt;
    });
    setText("");

    const response = await fetch(`/api/chat/apiResponse`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message: text,
      }),
    });
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    let content = "";
    await streamReader(reader, (text) => {
      if (text.event === "newChatId") {
        setNewChatId(text.content);
      } else {
        setMessageFromAI((prev) => `${prev}${text.content}`);
        content = content + text.content;
      }
    });

    setAllMessages(content);
    setMessageFromAI("");
    setIsLoading(false);
  };

  const allUserPrompts = [...messages, ...userPrompt];

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <div className="grid h-screen grid-cols-[320px_1fr]">
        <Sidebar chatId={chatId} />
        <div className="bg-[#2f333c] max-h-screen">
          <div className="flex flex-col h-full">
            <header className="flex justify-between items-center px-8 py-6 bg-[#111111]/90 text-lg tracking-wide">
              <div className="flex gap-3">
                <FontAwesomeIcon icon={faComments} className="text-[#EDEBE8] w-6" />
                {/* <input
                  type="text"
                  className={`text-[#EDEBE8] bg-transparent px-3 py-2`}
                  ref={ref}
                  maxLength={20}
                  minLength={3}
                  value={currentTitle}
                  disabled={!titleEdit}
                  onChange={(e) => setTitle(e.target.value)}
                /> */}
                {/* {titleEdit && (
                  <div className="p-3.5 bg-[#252527] rounded-md" onClick={submitTitle}>
                    <FontAwesomeIcon icon={faCheck} className="text-[#EDEBE8] w-4 " />
                  </div>
                )} */}
                <p className="text-[#EDEBE8]">Conversation with AI</p>
              </div>
              <div className="flex gap-4">
                <div className="p-3.5 bg-[#252527] rounded-md">
                  <FontAwesomeIcon icon={faEdit} className="text-[#EDEBE8] w-4 " />
                </div>
                <div className="p-3.5 bg-[#252527] rounded-md">
                  <FontAwesomeIcon icon={faTrashCan} className="text-[#EDEBE8] w-4 " />
                </div>
              </div>
            </header>
            <div className="flex-1 bg-[#111111] text-white overflow-y-auto p-6">
              {allUserPrompts.map((prompt) => (
                <MessageBox
                  key={prompt._id}
                  role={prompt.role}
                  content={prompt.content}
                />
              ))}

              {messageFromAI && <MessageBox role="assistant" content={messageFromAI} />}
            </div>
            <footer className="bg-[#111111] px-8 py-8">
              <form onSubmit={handleSubmit}>
                <fieldset className="flex relative" disabled={isLoading}>
                  <textarea
                    value={text}
                    onChange={(e) => handleMessage(e)}
                    className="w-full resize-none rounded-lg bg-[#1C1A1D]  py-4 px-4 max-h-18 text-white focus:bg-[#1C1A1D] focus:outline focus:outline-gray-600 lg:text-lg tracking-wide"
                    placeholder={isLoading ? "" : "Magic begins here..."}
                  />
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 p-3 rounded-md transform -translate-y-1/2  disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-[#EDEBE8] w-6" />
                  </button>
                </fieldset>
              </form>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const chatId = context.params?.chatId?.[0] || null;
  if (chatId) {
    const session = await getSession(context.req, context.res);
    const user = session?.user;
    const client = await clientPromise;

    const db = client.db("AiWizard");
    const chat = await db.collection("chats").findOne({
      userId: user?.sub,
      _id: new ObjectId(chatId),
    });

    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    return {
      props: {
        chatId,
        title: chat?.title,
        messages: chat?.messages.map((message: newMessageProps) => ({
          ...message,
          _id: uuid4(),
        })),
      },
    };
  }
  return {
    props: {},
  };
};

export default Chat;
