const express = require("express");
const axios = require("axios");
const router = express.Router();
const { loadMusicBrainzApi } = require("musicbrainz-api");

router.get("/user", async (req, res) => {
  const accessToken = req.cookies.spotifyAccessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userUrl = "https://api.spotify.com/v1/me";

    const response = await axios.get(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Access token expired" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/top-artists", async (req, res) => {
  const accessToken = req.cookies.spotifyAccessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const topArtists = "https://api.spotify.com/v1/me/top/artists";

    const response = await axios.get(topArtists, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const artists = response.data.items;

    const { MusicBrainzApi } = await loadMusicBrainzApi();

    const mbApi = new MusicBrainzApi({
      appName: "my-app",
      appVersion: "0.1.0",
      appContactInfo: "user@mail.org",
    });

    const artistCountries = await Promise.all(
      artists.map(async (artist) => {
        try {
          const musicBrainzResponse = await mbApi.browse("artist", {
            query: artist.name,
          });

          const artistData = musicBrainzResponse.artists[0];

          if (!artistData) {
            return null;
          }

          return {
            name: artist.name,
            country: artistData.country || null,
          };
        } catch (error) {
          console.error(
            `Error fetching data for artist: ${artist.name}`,
            error
          );
          return { name: artist.name, country: null };
        }
      })
    );

    res.json(artistCountries);
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Access token expired" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
