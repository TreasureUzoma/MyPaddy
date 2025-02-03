import React from "react";
import useConversation from "../hooks/useConversation";
import ReactMarkdown from "react-markdown";

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
        handlePromptClick,
    } = useConversation();

    const renderMessage = (message, index) => (
        <div
            key={index}
            className={`mb-[1.75rem] font-poppins flex w-full ${
                message.isYou ? "justify-end" : "justify-start"
            }`}
        >
            <span className="max-w-[250px] md:max-w-[350px] lg:max-w-[495px] overflow_break">
                <span
                    className={`p-4 px-5 rounded-2xl mb-2 flex flex-wrap ${
                        message.isYou ? "bg-blue-600" : "bg-[#2a2a2a]"
                    } break-words whitespace-normal`}
                >
                    {message.isYou ? message.text : <ReactMarkdown>{message.text}</ReactMarkdown>}
                </span>
            </span>
        </div>
    );

    return (
        <main>
            <section className="mt-[5rem] min-h-[83vh] md:min-h-screen p-5 pb-[0px] flex flex-col justify-between">
                <div className="flex flex-grow flex-col items-end text-[0.74rem] mb-[5.21rem]">
                    {currentConversation.map((message, index) =>
                        renderMessage(message, index)
                    )}
                    <div ref={chatEndRef} />
                    {loading && (
                        <div className="justify-start flex w-full text-gray-400 mt-2 mb-7">
                            is Typing...
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
                                <div className="my-4 grid place-items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 font-poppins md:gap-6">
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
                                            <p className="text-[0.75rem] text-[#bbb]">
                                                {prompt.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="py-3 bg-myBlack w-full relative">
                        <div className="flex justify-between items-center rounded-3xl p-2 bg-[#1e1f21] w-full">
                            <textarea
                                className="w-full font-poppins px-4 py-1 bg-transparent text-sm text-white min-h-5 max-h-[10rem] resize-none overflow-y-auto"
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
                                    href="#"
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
