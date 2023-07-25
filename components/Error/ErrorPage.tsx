import { useRouter } from "next/router";
import React from "react";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <section className="bg-white dark:bg-[#111111] ">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col gap-2 items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-red-400 rounded-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900  md:text-3xl bg-[#d74545] px-12 py-8 rounded-lg">
            404 Page Not Found
          </h1>

          <div className="flex items-center w-full mt-8 gap-x-3 shrink-0 sm:w-auto">
            <button
              className="flex items-center justify-center w-1/2 px-6 py-3  transition-colors duration-200 bg-[#FAE69E] rounded-lg gap-x-2 sm:w-auto text-[#111111] hover:bg-[#e1cf8e]"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>Go back</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
