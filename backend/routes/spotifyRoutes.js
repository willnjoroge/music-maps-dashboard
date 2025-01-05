const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/top-songs", async (req, res) => {
  const accessToken = req.cookies.spotifyAccessToken;

  console.log(accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const savedSongs = "https://api.spotify.com/v1/me/top/artists";

    const response = await axios.get(savedSongs, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Access token expired" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
