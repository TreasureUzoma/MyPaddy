import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import messages from "../utility/messages.json";
import { geminiPrompt } from "../libs/prompt.js";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const useConversation = () => {
    const [randomPrompts, setRandomPrompts] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isYourTurn, setIsYourTurn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);
    const chatEndRef = useRef(null);

    // Toggle the reasoning state
    const toggleReasoning = () => {
        setIsReasoningEnabled(prev => !prev);
    };

    // Model selection based on reasoning toggle
    const model = isReasoningEnabled
        ? genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" })
        : genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
    const handleInput = useCallback(event => {
        const value = event.target.value;
        setInputValue(value);
    }, []);

    // Handle sending the message to the AI
    const handleSendMessage = useCallback(
        async message => {
            const msg = message || inputValue;
            if (msg && isYourTurn) {
                // Add the user's message to the conversation first
                setCurrentConversation(prev => [
                    ...prev,
                    { text: msg, isYou: true } // User message
                ]);
                setShowPrompts(false);
                setInputValue("");
                setIsYourTurn(false);
                setLoading(true);

                try {
                    const context = currentConversation
                        .slice(-16)
                        .map(m => m.text)
                        .join("\n");
                    const fullMessage = `${geminiPrompt}
                    
                    Context:\n${context}\nUser: ${msg}`;

                    const result = await model.generateContentStream([
                        fullMessage
                    ]);
                    setLoading(false);
                    let chatResponse = ""; // to accumulate the full response
                    const lastMessageIndex = currentConversation.length; // track last message

                    for await (const chunk of result.stream) {
                        const chunkText = await chunk.text();
                        chatResponse += chunkText; // Append the chunk of text

                        // Update the conversation state with the latest chunk
                        setCurrentConversation(prev => {
                            const updatedConversation = [...prev];
                            updatedConversation[lastMessageIndex + 1] = {
                                text: chatResponse,
                                isYou: false
                            };
                            return updatedConversation;
                        });
                    }

                    setIsYourTurn(true);
                } catch (error) {
                    const chatResponse = "Something went wrong 🥺";
                    setCurrentConversation(prev => [
                        ...prev,
                        { text: chatResponse, isYou: false }
                    ]);
                    setIsYourTurn(true);
                    console.error("Error fetching response:", error);
                } finally {
                    setLoading(false);
                }
            }
        },
        [inputValue, currentConversation, isYourTurn, model]
    );

    // Handle prompt click
    const handlePromptClick = async prompt => {
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
        isReasoningEnabled,
        toggleReasoning
    };
};

export default useConversation;
