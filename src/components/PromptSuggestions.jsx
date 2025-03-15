import React from "react";

const PromptSuggestions = ({ randomPrompts, handlePromptClick }) => {
  return (
    <>
      <b className="text-center block my-4 text-lg">PaddyAI</b>
      <div className="my-4 grid place-items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {randomPrompts.map((prompt, index) => (
          <div
            key={index}
            className="border border-1 border-[#383838] rounded-2xl p-3 w-full cursor-pointer"
            onClick={() => handlePromptClick(prompt)}
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
  );
};

export default PromptSuggestions;