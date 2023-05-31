import {
  faCheck,
  faHandSparkles,
  faHatWizard,
  faWandMagic,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatExamples = () => {
  return (
    <div className="flex flex-col gap-16 justify-start items-center h-full mt-8 overflow-scroll">
      <div className="flex gap-6 justify-center items-center flex-wrap">
        <FontAwesomeIcon icon={faHatWizard} className="text-white w-10" />
        <h1 className="text-3xl tracking-wide font-semibold text-center">Wizard AI</h1>
      </div>
      <section className="flex flex-col items-center gap-8 w-full text-center">
        <article className="space-y-4 w-full ">
          <div className="flex items-center justify-center gap-4">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-white w-6" />
            <h3 className="text-lg tracking-wide">Examples</h3>
          </div>
          <ul className="space-y-4">
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px]  mx-auto">
              &quot;Who is the tallest man on earth&quot;
            </li>
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px] mx-auto">
              &quot;Who was the 4th president of South Korea?&quot;
            </li>
          </ul>
        </article>
        <article className="space-y-4 w-full ">
          <div className="flex items-center justify-center gap-4">
            <FontAwesomeIcon icon={faWandMagic} className="text-white w-5" />
            <h3 className="text-lg tracking-wide">Capabilities</h3>
          </div>
          <ul className="space-y-4">
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px] mx-auto">
              &quot;Repeat the first question&quot;
            </li>
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px] mx-auto">
              &quot;Write a new answer&quot;
            </li>
          </ul>
        </article>
        <article className="space-y-4 w-full ">
          <div className="flex items-center justify-center gap-4">
            <FontAwesomeIcon icon={faHandSparkles} className="text-white w-6" />
            <h3 className="text-lg tracking-wide">Limitations</h3>
          </div>
          <ul className="space-y-4">
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px] mx-auto">
              &quot;Information can be limited and not fully correct&quot;
            </li>
            <li className="bg-gray-500/10 p-3 rounded-md md:max-w-[500px] mx-auto">
              &quot;Unique questions take time to load&quot;
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default ChatExamples;
