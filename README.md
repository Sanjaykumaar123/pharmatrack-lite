# PharmaTrack Lite

This is a Next.js project for a pharmacy inventory management system, prototyped in Firebase Studio.

## Running the Project Locally

To run this project on your local machine using Visual Studio Code, please follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later is recommended)
- [npm](https://www.npmjs.com/) (which comes bundled with Node.js)
- A **Google AI Gemini API Key**. You can generate a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup and Installation

1.  **Open the Project in VS Code**:
    Open the project folder you downloaded in Visual Studio Code.

2.  **Install Dependencies**:
    Open a terminal in VS Code (`Terminal` > `New Terminal`) and run the following command to install all the required packages for the project:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    The AI features in this application require a Gemini API key. You need to create a file to store this key securely.

    - In the root directory of the project, you'll find a file named `.env`.
    - Open this file and add your Gemini API key like this:
      ```
      GEMINI_API_KEY=YOUR_API_KEY_HERE
      ```
    - Replace `YOUR_API_KEY_HERE` with the actual key you obtained from Google AI Studio.

### Running the Application

This project has two parts that need to run simultaneously: the main web application and the Genkit AI server.

1.  **Start the Web Application**:
    In your VS Code terminal, run the following command to start the Next.js development server:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

2.  **Start the Genkit AI Server**:
    Open a **second terminal** in VS Code (you can click the `+` icon in the terminal panel). In this new terminal, run the following command:
    ```bash
    npm run genkit:dev
    ```
    This starts the local server that powers the AI assistant and other generative features.

You should now have both servers running, and you can access the web application in your browser at the address provided in the first terminal.
