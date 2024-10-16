import React, { useEffect, useState } from "react";
import { adjustHeight } from "../utility/inputControl.js";
import messages from "../utility/messages.json"; // Import the JSON file directly
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Main = () => {
    const [randomPrompts, setRandomPrompts] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);

    useEffect(() => {
        const shuffled = messages.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 3);
        setRandomPrompts(selectedPrompts);
    }, []);

    const handleInput = event => {
        const textarea = event.target;
        setInputValue(textarea.value);
        adjustHeight(textarea);
        validateTextarea(textarea);
    };

    const validateTextarea = textarea => {
        const button = document.getElementById("sendButton");
        const hasContent = /\S/.test(textarea.value);
        button.disabled = !hasContent;
        button.classList.toggle("cursor-not-allowed", !hasContent);
        button.classList.toggle("bg-gray-600", !hasContent);
        button.classList.toggle("text-gray-800", !hasContent);
        button.classList.toggle("bg-white", hasContent);
        button.classList.toggle("text-black", hasContent);
    };

    const handlePromptClick = async prompt => {
        await handleSendMessage(prompt.title + " " + prompt.description); // Send the selected prompt as a message
    };

    const handleSendMessage = async message => {
        const msg = message || inputValue.trim();
        if (msg) {
            setCurrentConversation(prev => {
                const newMessages = [...prev, msg];
                return newMessages.slice(-5); // Keep only the last 5 messages
            });

            setShowPrompts(false);

            try {
                setInputValue("");
                document.getElementById("messageTextarea").value = "";
                document.getElementById("sendButton").disabled = true;

                const result = await model.generateContent(
                    currentConversation.concat(`
                You’re a helpful AI named PaddyAI. You are very sharp and you understand things easily. Only add emojis to your messages when necessary. Sound Human. Don't ask irrelevant messages 
                now reply this:
                ${msg}`)
                );
                let response = await result.response;
                let chatResponse = await response.text();

                setCurrentConversation(prev =>
                    [...prev, chatResponse].slice(-5)
                ); // Update with response
            } catch (error) {
                console.error("Error fetching Gemini response:", error);
            }
        }
    };

    return (
        <main>
            <section className="mt-[5rem] min-h-[89vh] md:min-h-screen p-5 flex flex-col justify-between">
                <div className="mt-5 flex-grow">
                    {currentConversation.map((message, index) => (
                        <div
                            key={index}
                            className="bg-[#2a2a2a] text-white p-2 rounded-lg mt-2"
                        >
                            {message}
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 mt-5 w-full p-4 z-10">
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
                                id="messageTextarea"
                                className="w-full font-poppins px-4 py-2 bg-transparent text-sm text-white h-9 max-h-50 resize-none overflow-y-auto"
                                onChange={handleInput}
                                value={inputValue}
                                placeholder="Message Paddy..."
                            ></textarea>
                            <button
                                id="sendButton"
                                className="ml-4 px-3 py-2 rounded-3xl bg-gray-600 text-gray-800 cursor-not-allowed"
                                onClick={() => handleSendMessage()}
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
