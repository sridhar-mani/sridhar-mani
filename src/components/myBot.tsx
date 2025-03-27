import { AnimatePresence, motion } from "framer-motion";
import { Bot, BotMessageSquare, SendHorizontal } from "lucide-react";
import React, { useState } from "react";
import { aiworker, getReply } from "../utils/main";
import { useIsMobile } from "./Projects";

interface chating {
  sender: "user" | "bot";
  text: string;
}

function MyBot() {
  const [messages, setMessages] = useState("");
  const [chating, setChating] = useState<chating[]>([]);
  const [activSession, setActivSess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callingLLM = async () => {
    if (!messages.trim() && !isLoading) return;

    setIsLoading(true);

    await aiworker.initEngine();

    const res = await getReply({ messages: messages });
    setChating([
      ...chating,
      { sender: "user", text: messages },
      { sender: "bot", text: res },
    ]);
    setMessages("");
    setIsLoading(false);
  };
  return (
    <>
      <AnimatePresence>
        {activSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, x: 90, y: 130 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, x: 90, y: 130 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-80 h-[60%] rounded-xl  fixed z-20 bottom-16 right-16 bg-gradient-to-r items-start flex justify-center  from-indigo-500 to-purple-500"
          >
            <div className="h-[80%] w-[95%] transparent-scrollbar overflow-x-hidden overflow-scroll">
              {" "}
              {chating.map((each, index) => (
                <div
                  key={`${index}`}
                  className={`p-2 text-xs hover:shadow-md  transition-all duration-300 my-1 rounded-lg text-white ${
                    each.sender === "user"
                      ? "bg-gray-700 hover:shadow-gray-500 w-fit rounded-2xl px-4 place-self-end text-right"
                      : "bg-indigo-500 hover:shadow-indigo-600 rounded-2xl px-4  w-fit text-left"
                  }`}
                >
                  {each.text}
                </div>
              ))}
            </div>
            <div className="w-[90%] h-14 bottom-3 absolute">
              <textarea
                value={messages}
                onChange={(e) => setMessages(e.target.value)}
                style={{ width: "100%", height: "100%" }}
                placeholder="Type a message..."
                className="w-full h-full p-2 text-xs resize-none pr-10 overflow-auto rounded-lg bg-white text-gray-800 border transparent-scrollbar overflow-x-hidden border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
              <button
                onClick={callingLLM}
                onKeyDownCapture={(e) => {
                  if (e.key === "Enter") callingLLM();
                }}
                className="w-8 h-8 hover:scale-110 flex items-center justify-center absolute bottom-3 right-2 rounded-full bg-black"
              >
                {isLoading ? (
                  <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-transparent  text-4xl animate-spin flex items-center justify-center border-t-indigo-400 rounded-full"></div>
                  </div>
                ) : (
                  <SendHorizontal
                    className="hover:-rotate-12 focus:scale-100"
                    size={18}
                  />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!useIsMobile() && (
        <button
          className="w-12 h-12 z-20 flex items-center justify-center bg-gray-800 rounded-full  fixed bottom-5 right-5"
          onClick={() => setActivSess(!activSession)}
          aria-label="Toggle session"
        >
          {activSession ? (
            <BotMessageSquare color="#6366F1" />
          ) : (
            <Bot color="#6366F1" />
          )}
        </button>
      )}
    </>
  );
}

export default MyBot;
