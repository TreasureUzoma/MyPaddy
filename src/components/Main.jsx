import { adjustHeight } from '../utility/inputControl.js';

const Main = () => {
  const handleInput = (event) => {
    const textarea = event.target;
    adjustHeight(textarea);
    validateTextarea(textarea);
  };

  const validateTextarea = (textarea) => {
    const button = document.getElementById('sendButton');
    const hasContent = /\S/.test(textarea.value);

    if (hasContent) {
      button.disabled = false;
      button.classList.remove('bg-gray-500', 'text-gray-600', 'cursor-not-allowed');
      button.classList.add('bg-white', 'text-black', 'cursor-pointer');
    } else {
      button.disabled = true;
      button.classList.remove('bg-white', 'text-black', 'cursor-pointer');
      button.classList.add('bg-gray-500', 'text-gray-600', 'cursor-not-allowed');
    }
  };

  return (
    <main>
      <section className="mt-[5rem] min-h-[89vh] md:min-h-screen p-5">
        <div className="fixed bottom-0 left-0 right-0 mt-5 w-full p-4 z-10">
          <div className="flex justify-between items-center rounded-3xl p-2 bg-[#1e1f21] w-full">
            
            <textarea
              id="messageTextarea"
              className="w-full px-4 py-2 bg-transparent text-sm text-white h-9 max-h-50 resize-none overflow-y-auto"
              onInput={handleInput}
              placeholder="Message Paddy..."
            ></textarea>
            <button
              id="sendButton"
              className="ml-4 px-3 py-2 rounded-3xl bg-gray-500 text-gray-600 cursor-not-allowed"
              disabled
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
              >&nbsp;Learn more.</a>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Main;
