# PaddyAI: Your Friendly AI Chat Buddy 🤖

PaddyAI is an open-source, interactive web application that lets you chat with a friendly and intelligent AI, powered by Google's Gemini API. Have engaging and insightful conversations right in your browser!

## 🚀 Getting Started

Get PaddyAI up and running on your local machine with these simple steps:

### Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TreasureUzoma/MyPaddy
    cd paddyai
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    -   Create a `.env` file in the root directory.
    -   Add your Google Gemini API key:

        ```
        VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        ```

    **Note:** Ensure you have a valid Google Gemini API key. You can obtain one from the [Google AI Studio](https://makersuite.google.com/app/apikey).

4.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will start the Vite development server, and you can access the application in your browser at `http://localhost:5173`.

## 🔧 Usage

Using PaddyAI is straightforward:

1.  Type your message in the input box at the bottom of the screen.
2.  Click the send button (paper plane icon) to send your message to PaddyAI.
3.  Read PaddyAI's response in the chat window.
4.  Alternatively, click one of the suggested prompts for quick conversation starters.

## ✨ Features

-   **Interactive Chat:** Engage in real-time conversations with an AI.
-   **Google Gemini API:** Powered by Google's advanced language model for intelligent responses.
-   **Random Prompts:** Get conversation starters with a selection of random prompts.
-   **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
-   **Markdown Support:** Rendered markdown from AI responses.
-   **Clean UI:** Simple and intuitive user interface.

## 🛠️ Technologies Used

| Technology   | Description                                          |
| :----------- | :--------------------------------------------------- |
| React        | JavaScript library for building user interfaces     |
| Vite         | Fast build tool and development server               |
| Tailwind CSS | Utility-first CSS framework for styling              |
| Google Gemini API |  Provides AI capabilities |
| React Markdown | Markdown component for React                      |
| ESLint       | Linter for JavaScript and JSX code                  |

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute to PaddyAI:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3.  **Make your changes** and commit them with descriptive commit messages.
4.  **Push your branch** to your forked repository.
5.  **Submit a pull request** to the main branch of the original repository.

### Development Setup

To set up your development environment:

1.  Follow the installation steps outlined above.
2.  Make sure ESLint is configured in your editor for code linting.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE.txt).

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
