import React, { useEffect, useState, useRef } from "react";
import { adjustHeight } from "../utility/inputControl.js";
import messages from "../utility/messages.json";
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
    const [isYourTurn, setIsYourTurn] = useState(true);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const shuffled = messages.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 3);
        setRandomPrompts(selectedPrompts);
    }, []);

    useEffect(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
            adjustHeight(textarea);
        }
        setIsButtonDisabled(!/\S/.test(inputValue));
    }, [inputValue]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentConversation]);

    const handleInput = event => {
        const value = event.target.value;
        setInputValue(value);
    };

    const handlePromptClick = async prompt => {
        await handleSendMessage(`${prompt.title} ${prompt.description}`);
    };

    const formatTagsOnly = text => {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const formatResponse = text => {
        // Escape HTML tags first
        text = formatTagsOnly(text);

        // Replace spaces with &nbsp;
        text = text.replace(/ /g, "&nbsp;");

        // Replace double line breaks (for paragraphs) with <br />
        text = text.replace(/\n\s*\n/g, "<br />");

        // Format for markdown-like syntax
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/`([^`]+)`/g, "<code>$1</code><br />");
        text = text.replace(/``\n?([\s\S]*?)\n?``/g, "<code>$1</code><br />");
        text = text.replace(/^\s*\*\s+(.*)$/gm, "<br /><li>$1</li>");
        text = text.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
        text = text.replace(/\n/g, "<br />"); // Add line breaks
        return text;
    };

    const formatUserMessage = text => {
        // Replace spaces with &nbsp;
        text = text.replace(/ /g, "&nbsp;");
        // Replace new lines with <br />
        text = text.replace(/\n/g, "<br />");
        return text;
    };

    const handleSendMessage = async message => {
        const msg = message || inputValue.trim();
        if (msg && isYourTurn) {
            // Format only the user message
            const formattedUserMessage = formatUserMessage(msg);

            setCurrentConversation(prev => [
                ...prev,
                { text: formattedUserMessage, isYou: true } // User message formatted
            ]);
            setShowPrompts(false);
            setInputValue("");
            setIsYourTurn(false);
            setLoading(true); // Show loader

            try {
                const context = currentConversation
                    .slice(-8)
                    .map(m => m.text)
                    .join("\n");
                const fullMessage = `Reply Guide Rule: You’re a helpful AI named PaddyAI. You are very sharp and you understand things easily. Only add emojis to your messages when necessary. Sound Human. Don't ask irrelevant questions. Context:\n${context}\nUser: ${msg}`;

                const result = await model.generateContent([fullMessage]);
                let response = await result.response;
                let chatResponse = await response.text();

                chatResponse = formatResponse(chatResponse); // Format bot's response

                setCurrentConversation(prev => [
                    ...prev,
                    { text: chatResponse, isYou: false }
                ]);
                setIsYourTurn(true);
            } catch (error) {
                console.error("Error fetching Gemini response:", error);
            } finally {
                setLoading(false); // Hide loader
            }
        }
    };

    const renderMessage = (message, index) => {
        return (
            <div
                key={index}
                className={`mb-[1.2em] font-poppins flex w-full ${
                    message.isYou ? "justify-end" : "justify-start"
                }`}
            >
                <span
                    className={`p-4 rounded-2xl mb-2 max-w-[250px] flex flex-wrap break-words overflow-wrap break-normal break-all break-word ${
                        message.isYou ? "bg-blue-600" : "bg-[#2a2a2a]"
                    } md:max-w-[350px] lg:max-w-[495px]`}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                />
            </div>
        );
    };

    return (
        <main>
            <section className="mt-[5rem] min-h-[89vh] md:min-h-screen p-5 pb-[0px] flex flex-col justify-between">
                <div className="flex flex-grow flex-col items-end text-[0.74rem] mb-[5.21rem]">
                    {currentConversation.map((message, index) =>
                        renderMessage(message, index)
                    )}
                    <div ref={chatEndRef} /> {/* For scrolling */}
                    {loading && (
                        <div className="justify-start flex w-full text-gray-400 mt-2">
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
