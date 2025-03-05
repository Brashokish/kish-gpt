// index.js
const express = require('express');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (optional, if you have a frontend)
app.use(express.static('public'));

// Route to handle GPT queries
app.post('/gpt', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await fetch(`https://kish-chat-gpt.onrender.com/gpt?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response from GPT API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
