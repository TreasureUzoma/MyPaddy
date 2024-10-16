import React, { useEffect, useState } from "react";
import { adjustHeight } from "../utility/inputControl.js";
import messages from "../utility/messages.json"; // Import the JSON file directly
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Initialize the Gemini API with your API key
const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Main = () => {
    const [randomPrompts, setRandomPrompts] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showPrompts, setShowPrompts] = useState(true); // Control visibility of prompts and PaddyAI text

    useEffect(() => {
        // Shuffle and select 3 random prompts from imported messages
        const shuffled = messages.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 3);
        setRandomPrompts(selectedPrompts);
    }, []);

    const handleInput = (event) => {
        const textarea = event.target;
        setInputValue(textarea.value); // Update state with textarea value
        adjustHeight(textarea);
        validateTextarea(textarea);
    };

    const validateTextarea = (textarea) => {
        const button = document.getElementById("sendButton");
        const hasContent = /\S/.test(textarea.value);

        if (hasContent) {
            button.disabled = false;
            button.classList.remove(
                "bg-gray-600",
                "text-gray-500",
                "cursor-not-allowed"
            );
            button.classList.add("bg-white", "text-black", "cursor-pointer");
        } else {
            button.disabled = true;
            button.classList.remove("bg-white", "text-black", "cursor-pointer");
            button.classList.add(
                "bg-gray-500",
                "text-gray-600",
                "cursor-not-allowed"
            );
        }
    };

    const handlePromptClick = (prompt) => {
        setInputValue(prompt.title + ' ' + prompt.description); // Set the selected prompt into the textarea
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() !== "") {
            setCurrentConversation([...currentConversation, inputValue]); // Add user message to conversation

            // Hide custom prompts and "PaddyAI" text after sending the message
            setShowPrompts(false);

            // Call Gemini API to get a response
            try {
                const result = await model.generateContent(inputValue);
                let response = await result.response;
                let chatResponse = await response.text();

                // Add Gemini's response to the conversation
                setCurrentConversation((prev) => [...prev, chatResponse]);

                // Clear input after sending
                setInputValue("");
                document.getElementById("messageTextarea").value = ""; // Clear the textarea
                document.getElementById("sendButton").disabled = true; // Disable send button again
            } catch (error) {
                console.error("Error fetching Gemini response:", error);
            }
        }
    };

    return (
        <main>
            <section className="mt-[5rem] min-h-[89vh] md:min-h-screen p-5">
                <div className="fixed bottom-0 left-0 right-0 mt-5 w-full p-4 z-10">
                    <div className="py-4 my-5">
                        {/* Only show "PaddyAI" and custom prompts if the message hasn't been sent */}
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
                                            onClick={() => handlePromptClick(prompt)}
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
                    <div className="flex justify-between items-center rounded-3xl p-2 bg-[#1e1f21] w-full">
                        <textarea
                            id="messageTextarea"
                            className="w-full font-poppins px-4 py-2 bg-transparent text-sm text-white h-9 max-h-50 resize-none overflow-y-auto"
                            onInput={handleInput}
                            value={inputValue} // Controlled textarea
                            placeholder="Message Paddy..."
                        ></textarea>
                        <button
                            id="sendButton"
                            className="ml-4 px-3 py-2 rounded-3xl bg-gray-500 text-gray-600 cursor-not-allowed"
                            disabled
                            onClick={handleSendMessage}
                        >
                            <i className="fa-regular fa-paper-plane"></i>
                        </button>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-500 mt-2">
                            Paddy can make mistakes.
                            <a
                                href="#"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                &nbsp;Learn more.
                            </a>
                        </span>
                    </div>

                    {/* Display conversation */}
                    <div className="mt-5">
                        {currentConversation.map((message, index) => (
                            <div
                                key={index}
                                className="bg-[#2a2a2a] text-white p-2 rounded-lg my-2"
                            >
                                {message}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Main;
