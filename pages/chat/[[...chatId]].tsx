import Head from "next/head";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid4 } from "uuid";
import MessageBox from "../../components/MessageBox/MessageBox";
import { faComments, faTrashCan, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface newMessageProps {
  _id: string;
  role: string;
  content: string;
}

const Chat = () => {
  const [messageFromAI, setMessageFromAI] = useState("");
  const [text, setText] = useState("");
  const [userPrompt, setUserPrompt] = useState<newMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const response = await fetch("/api/database/createChat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: text, title: "Conversation with AI" }),
    });
    const data = await response.json();
    console.log("NEW CHAT: ", data);
    // const response = await fetch(`/api/chat/apiResponse`, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({ message: text }),
    // });
    // const data = response.body;
    // if (!data) {
    //   return;
    // }

    // const reader = data.getReader();
    // await streamReader(reader, (text) => {
    //   setMessageFromAI((prev) => prev + text.content);
    // });
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <div className="grid h-screen grid-cols-[320px_1fr]">
        <Sidebar />
        <div className="bg-[#2f333c] max-h-screen">
          <div className="flex flex-col h-full">
            <header className="flex justify-between items-center px-6 py-6 bg-[#111111]/90 text-lg tracking-wide">
              <div className="flex gap-4">
                <FontAwesomeIcon icon={faComments} className="text-[#EDEBE8] w-6 " />
                <p className="text-[#EDEBE8]">Conversation with AI</p>
              </div>
              <div>
                <div className="p-3.5 bg-[#252527] rounded-md">
                  <FontAwesomeIcon icon={faTrashCan} className="text-[#EDEBE8] w-4 " />
                </div>
              </div>
            </header>
            <div className="flex-1 bg-[#111111] text-white overflow-y-auto p-6">
              {userPrompt.map((prompt) => (
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

export default Chat;
