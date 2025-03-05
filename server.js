const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Initialize Gemini
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction: {
    role: "model",
    parts: [{ text: SYSTEM_INSTRUCTION_CONTENT }]
  },
  generationConfig: {
    temperature: 0.3,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });
    
    const result = await model.generateContent(message);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
