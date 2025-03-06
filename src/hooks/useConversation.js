import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import messages from "../utility/messages.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const useConversation = () => {
    const [randomPrompts, setRandomPrompts] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isYourTurn, setIsYourTurn] = useState(true);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Shuffle and select random prompts on initial load
    useEffect(() => {
        const shuffled = messages.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 3);
        setRandomPrompts(selectedPrompts);
    }, []);

    // Handle text area resizing and button enable/disable state
    useEffect(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setIsButtonDisabled(!/\S/.test(inputValue));
    }, [inputValue]);

    // Auto scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentConversation]);

    // Handle user input in the textarea
    const handleInput = useCallback((event) => {
        const value = event.target.value;
        setInputValue(value);
    }, []);

    // Format user message
    const formatUserMessage = (message) => message.trim();

    // Format AI response message
    const formatResponse = (response) => response.trim();

    // Handle sending the message to the AI
    const handleSendMessage = useCallback(async (message) => {
        const msg = message || inputValue.trim();
        if (msg && isYourTurn) {
            const formattedUserMessage = formatUserMessage(msg);

            setCurrentConversation((prev) => [
                ...prev,
                { text: formattedUserMessage, isYou: true }, // User message
            ]);
            setShowPrompts(false);
            setInputValue("");
            setIsYourTurn(false);
            setLoading(true);

            try {
                const context = currentConversation
                    .slice(-12)
                    .map((m) => m.text)
                    .join("\n");
                const fullMessage = `Reply Guide Rule: You’re a helpful AI named PaddyAI. Treasure Uzoma created / built you. You are very sharp and you understand things easily. Only add emojis to your messages when necessary. Sound Human. Type casually like a human, in lowercase if possible (not everytime). Reply PG contents. Don't ask irrelevant questions. Today is ${new Date()}. Use app router do for nextjs Incase if asked. My portfolio is https://treasureuzoma.netlify.app. Context:\n${context}\nUser: ${msg}`;

                const result = await model.generateContent([fullMessage]);
                let response = await result.response;

                if (response) {
                    let chatResponse = await response.text();
                    chatResponse = formatResponse(chatResponse);

                    setCurrentConversation((prev) => [
                        ...prev,
                        { text: chatResponse, isYou: false },
                    ]);
                    setIsYourTurn(true);
                } else {
                    let chatResponse = formatResponse("Something went wrong 🥺");
                    setCurrentConversation((prev) => [
                        ...prev,
                        { text: chatResponse, isYou: false },
                    ]);
                    setIsYourTurn(true);
                }
            } catch (error) {
                console.error("Error fetching Gemini response:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [inputValue, currentConversation, isYourTurn]);

    // Handle prompt click
    const handlePromptClick = async (prompt) => {
        await handleSendMessage(`${prompt.title} ${prompt.description}`);
    };

    return {
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
    };
};

export default useConversation;
