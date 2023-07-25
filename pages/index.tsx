import Head from "next/head";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "components/Loader/Loading";
import ErrorPage from "components/Error/ErrorPage";

export default function Home() {
  const { isLoading, error, user } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div>
      <Head>
        <title>Wizard AI login and sign up page</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-screen w-full bg-[#111111] text-white text-center gap-8">
        <div className="flex flex-col gap-4 justify-center items-center">
          <FontAwesomeIcon icon={faHatWizard} className="text-white w-14" />
          <h1 className="text-3xl tracking-wide">Wizard AI</h1>
          <p className="text-xl tracking-wide  text-[#848484]">
            Welcome to your free journey into the world of AI
          </p>
        </div>
        {!user && (
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/api/auth/login"
              className="rounded-md px-8 py-3 text-[#111111]
                  bg-[#FAE69E] hover:bg-[#e1cf8e] w-32 text-lg tracking-wide"
            >
              Login
            </Link>
            <Link
              href="/api/auth/signup"
              className="rounded-md  px-6 py-3 text-[#111111]
                  bg-[#FAE69E] hover:bg-[#e1cf8e] w-32 text-lg tracking-wide"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession(req, res);

  if (session) {
    return {
      redirect: {
        destination: "/chat",
        statusCode: 302,
      },
    };
  }

  return {
    props: {},
  };
};
