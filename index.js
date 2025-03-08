const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;
const host = '0.0.0.0';

const apiKey = "AIzaSyDL8lTQK78cwDfySVT_8JDbDXkgJyUcfV4"; // Replace with your actual YouTube API key

app.use(express.json());

app.get('/', (req, res) => {
  res.send("YouTube API is running.");
});

// YouTube API endpoint for searching videos
app.route('/youtube')
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).send("No query provided");
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          key: apiKey,
          maxResults: 5, // Adjust the number of results as needed
        },
      });

      const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
      }));

      return res.status(200).json(videos);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to fetch videos");
    }
  })
  .post(async (req, res) => {
    const query = req.body.query;

    if (!query) {
      return res.status(400).send("No query provided");
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          key: apiKey,
          maxResults: 5, // Adjust the number of results as needed
        },
      });

      const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
      }));

      return res.status(200).json(videos);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to fetch videos");
    }
  });

app.listen(port, host, () => {
  console.log(`YouTube API listening at http://${host}:${port}`);
});
