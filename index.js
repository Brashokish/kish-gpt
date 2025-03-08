const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;
const host = '0.0.0.0';

// Replace with your actual YouTube API key
const apiKey = "AIzaSyDL8lTQK78cwDfySVT_8JDbDXkgJyUcfV4"; 

app.use(express.json());

app.get('/', (req, res) => {
  res.send("YouTube API is running.");
});

// Function to fetch videos from YouTube API
const fetchVideos = async (query) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: query,
        key: apiKey,
        maxResults: 5, // Adjust the number of results as needed
        type: 'video', // Specify 'video' to fetch video content
      },
    });

    return response.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      videoId: item.id.videoId,
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos");
  }
};

// YouTube API endpoint for searching videos
app.route('/youtube')
  .get(async (req, res) => {
    const query = req.query.query || 'Faded'; // Default to 'Faded' if no query is provided
    if (!query) {
      return res.status(400).send("No query provided");
    }

    try {
      const videos = await fetchVideos(query);
      return res.status(200).json(videos);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  })
  .post(async (req, res) => {
    const query = req.body.query || 'Faded'; // Default to 'Faded' if no query is provided

    if (!query) {
      return res.status(400).send("No query provided");
    }

    try {
      const videos = await fetchVideos(query);
      return res.status(200).json(videos);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

app.listen(port, host, () => {
  console.log(`YouTube API listening at http://${host}:${port}`);
});
