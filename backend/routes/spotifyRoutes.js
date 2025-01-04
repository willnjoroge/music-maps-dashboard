const express = require("express");
const axios = require("axios");
const router = express.Router();

const getAccessToken = async () => {
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data.access_token;
};

router.get("/saved-songs", async (req, res) => {
  const accessToken = await getAccessToken();

  const savedSongs = `https://api.spotify.com/v1/{saved-songs}/`;

  const response = await axios.get(savedSongs, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response);

  res.json(response);
});

module.exports = router;
