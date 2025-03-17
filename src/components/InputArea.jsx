import React from "react";
const InputArea = ({
    inputValue,
    isButtonDisabled,
    isYourTurn,
    handleInput,
    handleSendMessage,
    isReasoningEnabled,
    toggleReasoning
}) => {
    return (
        <div className="py-3 pt-1 w-full relative bg-myBlack">
            <div className="flex flex-col rounded-3xl py-3 px-2 bg-neutral-800 border border-neutral-700 w-full mx-auto md:max-w-[67%]">
                <div className="flex items-end">
                    <textarea
                        className="w-full px-3 bg-transparent text-[0.85rem] text-white max-h-[10rem] resize-none overflow-y-auto m-auto placeholder:text-neutral-500"
                        onChange={handleInput}
                        value={inputValue}
                        placeholder="Message Paddy..."
                    />
                </div>
                <div className="flex px-2 items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                        {/* Reasoning Toggle Button */}
                        <button
                            className={`px-3 py-1 rounded-full flex items-center gap-2 font-medium text-[0.87rem] ${isReasoningEnabled ? "bg-blue-500 bg-opacity-10 text-blue-500 border-0" : "text-neutral-500 bg-transparent border border-neutral-500" }`}
                            onClick={toggleReasoning}
                        >
                            <i className={`fa-regular fa-lightbulb`}></i>
                            <span className="text-[0.85rem]">Reason</span>
                        </button>
                    </div>
                    {/* Send Button */}
                    <button
                        className={`px-[0.64rem] py-[0.2rem] rounded-full ${
                            isButtonDisabled || !isYourTurn
                                ? "bg-neutral-600 text-[#1e1f21] cursor-not-allowed"
                                : "bg-white text-black"
                        }`}
                        onClick={() => handleSendMessage()}
                        disabled={isButtonDisabled || !isYourTurn}
                    >
                        <i className="fa fa-arrow-up text-[0.93rem]"></i>
                    </button>
                </div>
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
    );
};
export default InputArea;
