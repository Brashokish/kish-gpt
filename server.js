require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Security and middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

// API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });
    
    const result = await model.generateContent(message);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      error: "Failed to generate response",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Access at: http://localhost:${port}`);
  }
});
