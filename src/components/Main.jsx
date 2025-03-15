import React, { useRef } from "react";
import useConversation from "../hooks/useConversation";
import Message from "./Message";
import PromptSuggestions from "./PromptSuggestions";
import InputArea from "./InputArea";

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
        isReasoningEnabled,
        toggleReasoning
    } = useConversation();

    return (
        <main>
            <section className="mt-[1.25rem] min-h-[83vh] md:min-h-screen px-5 flex flex-col justify-between">
                <div className="flex flex-grow flex-col items-end text-[0.79rem] mb-[8.2rem] md:mx-auto md:w-full md:max-w-[79%] md:mb-[6.5rem]">
                    {currentConversation.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                    <div ref={chatEndRef} />
                    {loading && (
                        <div className="justify-start flex w-full text-gray-400 mt-2 mb-12">
                            {isReasoningEnabled ? "Reasoning..." : "Thinking..."}
                        </div>
                    )}
                </div>
                <div className="fixed bottom-0 left-0 right-0 w-full p-4 pb-0 z-10">
                    <div className="py-4 my-5 mx-auto md:max-w-[67%]">
                        {showPrompts && (
                            <PromptSuggestions
                                randomPrompts={randomPrompts}
                                handlePromptClick={handlePromptClick}
                            />
                        )}
                    </div>

                    <InputArea
                        inputValue={inputValue}
                        isButtonDisabled={isButtonDisabled}
                        isYourTurn={isYourTurn}
                        handleInput={handleInput}
                        handleSendMessage={handleSendMessage}
                        isReasoningEnabled={isReasoningEnabled} // Make sure this is passed
                        toggleReasoning={toggleReasoning} // Make sure this is passed
                    />
                </div>
            </section>
        </main>
    );
};

export default Main;
