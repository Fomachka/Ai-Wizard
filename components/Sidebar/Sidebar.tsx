import Link from "next/link";
import { useEffect, useState } from "react";
import {
  faArrowRightFromBracket,
  faEllipsisH,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { useRouter } from "next/router";

interface ChatProps {
  messages: {
    content: string;
    role: string;
  }[];
  title: string;
  _id: string;
}
const Sidebar = ({
  chatId,
  toggleSideMenu,
  handleSideMenu,
}: {
  chatId: string | null;
  toggleSideMenu: boolean;
  handleSideMenu: () => void;
}) => {
  const [allChats, setAllChats] = useState<ChatProps[] | []>([]);
  const [menuToggle, setMenuToggle] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const handleMenuToggle = () => {
    setMenuToggle((prev) => !prev);
  };

  const fetchChats = async () => {
    const response = await fetch("/api/database/getChats", {
      method: "POST",
    });
    const json = await response.json();

    setAllChats(json?.chats || []);
  };

  const handleDeleteAllChats = async () => {
    await fetch("/api/database/deleteAllChats", {
      method: "DELETE",
    });
    router.push("/chat");
    setAllChats([]);
  };

  useEffect(() => {
    fetchChats();
  }, [chatId]);

  return (
    <div
      className={`flex bg-[#202123] text-white flex-col overflow-hidden px-4 py-4 md:flex md:static ${
        toggleSideMenu ? "absolute h-screen z-10" : "hidden "
      }`}
    >
      <div className="flex mb-4 justify-between items-center">
        {toggleSideMenu && (
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white w-5 md:hidden"
            onClick={handleSideMenu}
          />
        )}
        <h2 className="text-xl ml-1 tracking-wide">Chats</h2>
        <div className="rounded-full bg-[#FAE69E] w-7 h-7 flex justify-center items-center">
          <p className="text-black ">{allChats.length > 0 ? allChats.length : 0}</p>
        </div>
      </div>
      <div className="border-b border-gray-400/30 mb-4"></div>
      <Link
        href="/chat"
        className="py-4 px-6 bg-[#FAE69E] hover:bg-[#e1cf8e] transition-colors rounded-lg text-[#202123] flex gap-4 "
      >
        <FontAwesomeIcon icon={faPlus} className="text-[#202123] w-3" />
        <p className="">Create new chat</p>
      </Link>
      <div className="flex gap-3 items-center px-1 mt-6 mb-3 ">
        <p className=" text-gray-400 text-sm tracking-wide">All Chats</p>
      </div>
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {allChats?.map((chat: ChatProps) => (
          <Link
            href={`/chat/${chat._id}`}
            key={chat._id}
            className={`py-3 px-4 rounded-lg space-y-1 items-center hover:bg-[#343641] ${
              chatId === chat._id ? "bg-[#343641] " : ""
            }`}
          >
            <h3
              className="font-bold text-lg tracking-wide overflow-hidden text-ellipsis whitespace-nowrap"
              title={chat.title}
            >
              {chat.title[0].toUpperCase() + chat.title.substring(1)}
            </h3>
            <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[320px]">
              {chat.messages[1]?.content}
            </p>
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-400/30 mt-6 mb-4"></div>
      <div
        className={`flex justify-between items-center px-3 py-3 hover:bg-[#343641] rounded-lg hover:cursor-pointer relative ${
          menuToggle && "bg-[#343641] "
        }`}
        onClick={handleMenuToggle}
      >
        <div className="flex items-center gap-3">
          {user && (
            <Image
              src={user.picture as string}
              width={28}
              height={28}
              alt="avatar"
              className="rounded-md object-contain"
            />
          )}
          <p className="tracking-wide font-light ">{user?.name}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faEllipsisH} className="text-gray-400 w-4" />
        </div>
        <div
          className={`flex flex-col gap-2 py-2 absolute w-full left-0 top-[-140px] bg-[#111111] select-none rounded-lg ${
            menuToggle ? "inline-block" : "hidden"
          }`}
        >
          <div
            className="flex gap-4 justify-start px-5 py-3 hover:bg-[#343641]"
            onClick={handleDeleteAllChats}
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-white w-4" />
            <p>Clear all chats</p>
          </div>
          <div className="border-t border-gray-400/30 "></div>
          <Link href="/api/auth/logout">
            <div className="flex gap-4 justify-start px-5 py-3 hover:bg-[#343641] ">
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="text-white w-[18px]"
              />
              <p>Log out</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
