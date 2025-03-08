const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;

// Your YouTube API key
const apiKey = "AIzaSyAzVKQttzR760N9F1awRnejiSTcvfAyvI8";

app.use(express.json());

app.get('/', (req, res) => {
  res.send("YouTube API is running.");
});

// YouTube API endpoint for searching videos and audios
app.get('/youtube', async (req, res) => {
  const query = req.query.query || 'music'; // Default to 'music' if no query is provided

  if (!query) {
    return res.status(400).send("No query provided");
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: query,
        key: apiKey,
        maxResults: 10, // Adjust the number of results as needed
        type: 'video', // Fetch videos (includes music videos)
        videoCategoryId: 10, // Optional: Filter by music category (ID 10)
      },
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      videoId: item.id.videoId,
      type: 'video', // Indicate that this is a video
    }));

    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).send("Failed to fetch videos");
  }
});

app.listen(port, () => {
  console.log(`YouTube API listening at http://localhost:${port}`);
});
