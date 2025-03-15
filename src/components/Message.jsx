import React from "react";
import ReactMarkdown from "react-markdown";

const CodeBlock = ({ inline, className, children, ...props }) => {
  // Function to check if the provided code is inline (single line)
  const isInlineCode = (r) => r.includes('\n');

  if (!isInlineCode(children)) {
    return (
      <code
        {...props}
        className="px-1 py-0.5 rounded bg-neutral-700 text-[0.79rem] inline"
      >
        {children}
      </code>
    );
  } else {
    return (
      <div className="relative w-full my-2">
        <pre
          {...props}
          className="text-[0.79rem] w-full overflow-x-auto bg-zinc-900 p-4 border border-neutral-700 rounded-xl"
        >
          <code className="whitespace-pre-wrap break-words">
            {children}
          </code>
        </pre>
      </div>
    );
  }
};

const Message = ({ message }) => {
  return (
    <div
      className={`mb-[1.75rem] flex w-full ${
        message.isYou ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[92%]">
        <span
          className={`p-4 px-5 rounded-2xl mb-2 inline-block ${
            message.isYou
              ? "bg-blue-600 text-white"
              : "bg-[#2a2a2a] text-white"
          } break-words`}
          style={{
            wordBreak: "break-word",
          }} /* Adding it inline for extra insurance */
        >
          {message.isYou ? (
            message.text
          ) : (
            <ReactMarkdown
              className="max-w-md md:max-w-lg"
              components={{ code: CodeBlock }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </span>
      </div>
    </div>
  );
};

export default Message;
