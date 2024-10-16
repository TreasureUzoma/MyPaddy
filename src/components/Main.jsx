import React, { useEffect, useState } from "react";
import { adjustHeight } from "../utility/inputControl.js";
import messages from "../utility/messages.json"; // Import the JSON file directly
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Main = () => {
    const [randomPrompts, setRandomPrompts] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const shuffled = messages.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 3);
        setRandomPrompts(selectedPrompts);
    }, []);

    // Detect changes in textarea and adjust height
    useEffect(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
            adjustHeight(textarea);
        }

        setIsButtonDisabled(!/\S/.test(inputValue)); // Disable button if empty
    }, [inputValue]);

    const handleInput = event => {
        const value = event.target.value;
        setInputValue(value);
    };

    const handlePromptClick = async prompt => {
        await handleSendMessage(`${prompt.title} ${prompt.description}`);
    };

    const handleSendMessage = async message => {
        const msg = message || inputValue.trim();
        if (msg) {
            // Push the user message to the conversation
            setCurrentConversation(prev => {
                const newMessages = [...prev, { text: msg, sender: "user" }];
                return newMessages;
            });

            setShowPrompts(false);
            setInputValue("");

            try {
                const result = await model.generateContent([
                    ...currentConversation,
                    `You’re a helpful AI named PaddyAI. You are very sharp and you understand things easily. Only add emojis to your messages when necessary. Sound Human. Don't ask irrelevant questions. Reply to this: ${msg}`
                ]);

                let response = await result.response;
                let chatResponse = await response.text();

                // Push the AI response to the conversation
                setCurrentConversation(prev => [
                    ...prev,
                    { text: chatResponse, sender: "ai" }
                ]);
            } catch (error) {
                console.error("Error fetching Gemini response:", error);
            }
        }
    };

    return (
        <main>
            <section className="mt-[5rem] min-h-[89vh] md:min-h-screen p-5 pb-[0px] flex flex-col justify-between">
                <div className="flex-grow text-sm mb-[5.21rem]">
                    {currentConversation.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-[1.2em] font-poppins block ${
                                message.sender === "user" ? "text-right" : ""
                            }`}
                        >
                            <span
                                className={`p-3 rounded-2xl inline-flex mb-2 max-w-[250px] flex-wrap ${
                                    message.sender === "user"
                                        ? "bg-blue-600 ml-auto"
                                        : "bg-[#2a2a2a]"
                                }`}
                            >
                                {message.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 mt-5 w-full p-4 pb-0 z-10">
                    <div className="py-4 my-5">
                        {showPrompts && (
                            <>
                                <b className="text-center block my-4 text-lg">
                                    PaddyAI
                                </b>
                                <div className="my-4 grid place-items-center grid-cols-1 gap-4 md:grid-cols-2 font-poppins md:gap-6">
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
                                className="w-full font-poppins px-4 py-2 bg-transparent text-sm text-white h-9 max-h-50 resize-none overflow-y-auto"
                                onChange={handleInput}
                                value={inputValue}
                                placeholder="Message Paddy..."
                            ></textarea>
                            <button
                                className={`ml-4 px-3 py-2 rounded-3xl ${
                                    isButtonDisabled
                                        ? "bg-gray-600 text-gray-800 cursor-not-allowed"
                                        : "bg-white text-black"
                                }`}
                                onClick={() => handleSendMessage()}
                                disabled={isButtonDisabled}
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
