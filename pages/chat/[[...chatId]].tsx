import Head from "next/head";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid4 } from "uuid";
import MessageBox from "../../components/MessageBox/MessageBox";
import {
  faComments,
  faTrashCan,
  faPaperPlane,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import ChatExamples from "components/Chat/ChatExamples";

interface NewMessageProps {
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
  messages: NewMessageProps[] | [];
}) => {
  const router = useRouter();
  const [messageFromAI, setMessageFromAI] = useState("");
  const [toggleMenu, setMenuToggle] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState(chatId);
  const [userPrompt, setUserPrompt] = useState<NewMessageProps[] | []>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allMessages, setAllMessages] = useState("");
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const chatIsChanged = chatId !== currentChat;

  const handlePressingEnter = (event: any) => {
    if (event.code === "Enter") {
      handleSubmit(event);
    }
  };

  const handleMenu = () => {
    setMenuToggle((prev) => !prev);
    console.log(toggleMenu);
  };

  useEffect(() => {
    setUserPrompt([]);
    setNewChatId(null);
  }, [chatId]);

  useEffect(() => {
    if (allMessages && !isLoading && !chatIsChanged) {
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
  }, [allMessages, isLoading, chatIsChanged]);

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

  const handleDeleteSingleChat = async () => {
    await fetch(`/api/database/deleteChat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        chatId,
      }),
    });
    router.push(`/chat`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setCurrentChat(chatId);
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
        <title>{title}</title>
      </Head>
      <div className={`grid h-screen md:grid-cols-[320px_1fr] relative overflow-y-auto`}>
        <Sidebar
          chatId={chatId}
          toggleSideMenu={toggleMenu}
          handleSideMenu={handleMenu}
        />

        <div className="dark:bg-[#1C1A1D] bg-[#ebecef] max-h-screen">
          <div className="flex flex-col h-full">
            <header className="flex justify-between items-center px-8 py-6  text-lg tracking-wide">
              <div className="flex gap-6">
                <FontAwesomeIcon
                  icon={faBars}
                  className="dark:text-[#EDEBE8] text-[#757575] w-6 md:hidden"
                  onClick={handleMenu}
                />
                <FontAwesomeIcon
                  icon={faComments}
                  className="dark:text-[#EDEBE8] text-[#757575] w-6 hidden md:inline"
                />
                <p className="dark:text-[#EDEBE8] text-[#3b3b3b] hidden md:inline">
                  {title
                    ? title[0].toUpperCase() + title.substring(1)
                    : "Conversation with AI"}
                </p>
              </div>
              {messages.length > 0 && (
                <div
                  className="p-3.5 dark:bg-[#252527] bg-[#d1d0d365] rounded-md"
                  onClick={handleDeleteSingleChat}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="dark:text-[#EDEBE8] text-[#757575] w-4 "
                  />
                </div>
              )}
            </header>
            {messageFromAI && chatIsChanged && (
              <div className="bg-red-600/70 sticky-0 w-full h-24 flex justify-center items-center">
                <p className="text-lg text-[#fdfefe] tracking-wide ">
                  A message is currently generating in another chat. Please wait...
                </p>
              </div>
            )}
            <div className="flex-1 flex flex-col-reverse dark:bg-[#111111] bg-[#F6F8FC] text-white overflow-y-auto px-8 py-6">
              {!(allUserPrompts.length > 0) && !messageFromAI && <ChatExamples />}
              {allUserPrompts.length > 0 && (
                <div className="mb-auto space-y-6">
                  {allUserPrompts.map((prompt) => (
                    <MessageBox
                      key={prompt._id}
                      role={prompt.role}
                      content={prompt.content}
                    />
                  ))}
                  {messageFromAI && !chatIsChanged && (
                    <MessageBox role="assistant" content={messageFromAI} />
                  )}
                </div>
              )}
            </div>
            <footer className={`dark:bg-[#111111] bg-[#F6F8FC] px-8 py-8 `}>
              <form onSubmit={handleSubmit}>
                <fieldset className="flex relative" disabled={isLoading}>
                  <textarea
                    value={text}
                    onChange={(e) => handleMessage(e)}
                    className="w-full resize-none rounded-lg dark:bg-[#1C1A1D] py-4 px-4 max-h-18 bg-[#ebecef] dark:text-[#D1D5DB] text-[#454444] focus:outline  focus:outline-gray-400 lg:text-lg tracking-wide"
                    onKeyDown={handlePressingEnter}
                    placeholder={isLoading ? "" : "Magic begins here..."}
                  />
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 p-3 rounded-md transform -translate-y-1/2  dark:disabled:bg-gray-500 
                    disabled:bg-gray-400/70 disabled:cursor-not-allowed dark:hover:bg-[#252527] hover:bg-[#d1d0d365]"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      className="dark:text-[#EDEBE8] text-[#757575] w-6"
                    />
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
    let validId;

    try {
      validId = new ObjectId(chatId);
    } catch (error) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }
    const session = await getSession(context.req, context.res);
    const user = session?.user;
    const client = await clientPromise;

    const db = client.db("AiWizard");
    const chat = await db.collection("chats").findOne({
      userId: user?.sub,
      _id: validId,
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
        messages: chat?.messages.map((message: NewMessageProps) => ({
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
