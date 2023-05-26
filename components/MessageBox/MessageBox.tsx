import { useUser } from "@auth0/nextjs-auth0/client";
import { faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const MessageBox = ({ role, content }: { role: string; content: string }) => {
  const { user } = useUser();
  console.log("USER ", user);
  return (
    <div className={`flex gap-4 rounded-xl ${role === "user" && "flex-row-reverse"}`}>
      <div>
        {role === "user" && !!user && (
          <Image
            src={user.picture as string}
            width={44}
            height={44}
            alt="avatar"
            className="rounded-full shadow-md shadow-black/50 object-contain"
          />
          //   <p className="text-xs">{user.name}</p>
        )}
        {role === "assistant" && (
          <div className="flex bg-[#FAE69E] w-11 h-11 items-center justify-center rounded-full  text-white">
            <FontAwesomeIcon icon={faHatWizard} className="text-slate-800 w-6 " />
          </div>
        )}
      </div>
      <div className={`flex flex-col space-y-4 pt-1 ${role === "user" && "items-end"}`}>
        <div
          className={`flex gap-10 items-center ${role === "user" && "flex-row-reverse"}`}
        >
          <div className="text-sm font-semibold text-gray-200 ">
            {role === "assistant" ? "Mister AI" : user?.name}
          </div>
          <p className="text-[0.6rem] text-gray-400 tracking-wide">3:34PM</p>
        </div>
        <div
          className={`flex flex-col rounded-xl w-fit bg-[#1C1A1D]  tracking-wide lg:text-lg prose prose-invert prose-p:m-0 ${
            role === "user" ? "rounded-tr-none p-4" : "rounded-tl-none p-8"
          }`}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
