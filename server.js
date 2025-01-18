const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow frontend to communicate with the backend

// Replace with your Google Gemini API key
const apiKey = "AIzaSyB_ZFTlw-y0EIocVxhqIgp6QFfTOmL53Rg"; // Replace this with your API key
if (!apiKey) {
    console.error("API key is missing. Please set the API key.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1024,
    responseMimeType: "text/plain",
};

// Chat endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ response: "Message cannot be empty." });
    }

    console.log(`User Message: ${userMessage}`);

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(userMessage);
        console.log(`AI Response: ${result.response.text()}`);

        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error during chat processing:", error.message);
        res.status(500).json({ response: "An error occurred. Please try again later." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Chatbot backend is running at http://127.0.0.1:${port}`);
});
