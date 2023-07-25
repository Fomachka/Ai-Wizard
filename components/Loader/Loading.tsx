import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="px-10 py-6 text-2xl font-medium leading-none text-center bg-[#FAE69E] rounded-lg animate-pulse  dark:text-slate-900 ">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
