import React from "react";
import useConversation from "../hooks/useConversation";
import ReactMarkdown from "react-markdown";

const CodeBlock = ({ inline, className, children, ...props }) => {
  // Function to check if the provided code is inline (single line)
  const isInlineCode = (r) => r.includes('\n');

  if (!isInlineCode(children)) {
    return (
      <code
        {...props}
        className="px-1 py-0.5 rounded bg-neutral-700 text-[0.79rem] inline"
      >
        {children}
      </code>
    );
  } else {
    return (
      <div className="relative w-full my-2">
        <pre
          {...props}
          className="text-[0.79rem] w-full overflow-x-auto bg-zinc-900 p-4 border border-neutral-700 rounded-xl"
        >
          <code className="whitespace-pre-wrap break-words">
            {children}
          </code>
        </pre>
      </div>
    );
  }
};


const Main = () => {
    const {
        randomPrompts,
        currentConversation,
        inputValue,
        showPrompts,
        isButtonDisabled,
        isYourTurn,
        loading,
        chatEndRef,
        handleInput,
        handleSendMessage,
        handlePromptClick
    } = useConversation();

    const renderMessage = (message, index) => (
        <div
            key={index}
            className={`mb-[1.75rem] flex w-full ${
                message.isYou ? "justify-end" : "justify-start"
            }`}
        >
            <div className="max-w-[92%]">
                <span
                    className={`p-4 px-5 rounded-2xl mb-2 inline-block ${
                        message.isYou
                            ? "bg-blue-600 text-white"
                            : "bg-[#2a2a2a] text-white"
                    } break-words`}
                    style={{
                        wordBreak: "break-word"
                    }} /* Adding it inline for extra insurance */
                >
                    {message.isYou ? (
                        message.text
                    ) : (
                        <ReactMarkdown
                            className="max-w-md md:max-w-lg"
                            components={{ code: CodeBlock }}
                        >
                            {message.text}
                        </ReactMarkdown>
                    )}
                </span>
            </div>
        </div>
    );

    return (
        <main>
            <section className="mt-[1rem] min-h-[83vh] md:min-h-screen p-5 pb-[0px] flex flex-col justify-between">
                <div className="flex flex-grow flex-col items-end text-[0.79rem] mb-[5.21rem]">
                    {currentConversation.map((message, index) =>
                        renderMessage(message, index)
                    )}
                    <div ref={chatEndRef} />
                    {loading && (
                        <div className="justify-start flex w-full text-gray-400 mt-2 mb-7">
                            Thinking...
                        </div>
                    )}
                </div>
                <div className="fixed bottom-0 left-0 right-0 mt-5 w-full p-4 pb-0 z-10">
                    <div className="py-4 my-5">
                        {showPrompts && (
                            <>
                                <b className="text-center block my-4 text-lg">
                                    PaddyAI
                                </b>
                                <div className="my-4 grid place-items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                                    {randomPrompts.map((prompt, index) => (
                                        <div
                                            key={index}
                                            className="border border-1 border-[#383838] rounded-2xl p-3 w-full cursor-pointer"
                                            onClick={() =>
                                                handlePromptClick(prompt)
                                            }
                                        >
                                            <h3 className="font-semibold text-[0.85rem] text-[#ccc]">
                                                {prompt.title}
                                            </h3>
                                            <p className="text-[0.77rem] text-[#bbb]">
                                                {prompt.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="py-3 bg-myBlack w-full relative">
                        <div className="flex justify-between items-center rounded-3xl py-1 px-2 bg-[#1e1f21] w-full">
                            <textarea
                                className="w-full px-4 py-2 bg-transparent text-[0.85rem] text-white max-h-[10rem] resize-none overflow-y-auto m-auto"
                                onChange={handleInput}
                                value={inputValue}
                                placeholder="Message Paddy..."
                                disabled={!isYourTurn}
                            ></textarea>

                            <button
                                className={`ml-4 px-3 py-2 rounded-3xl ${
                                    isButtonDisabled || !isYourTurn
                                        ? "bg-gray-600 text-[#1e1f21] cursor-not-allowed"
                                        : "bg-white text-black"
                                }`}
                                onClick={() => handleSendMessage()}
                                disabled={isButtonDisabled || !isYourTurn}
                            >
                                <i className="fa-regular fa-paper-plane"></i>
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-xs text-gray-400 mt-2">
                                Paddy can make mistakes.
                                <a
                                    href="https://ai.google.com"
                                    target="_blank"
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    &nbsp;Learn more.
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Main;
