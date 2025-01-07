import express from "express";
import axios from "axios";

import { MusicBrainzApi } from "musicbrainz-api";
import pLimit from "p-limit";

const limit = pLimit(50);
const mbApi = new MusicBrainzApi({
  appName: "my-app",
  appVersion: "0.1.0",
  appContactInfo: "user@mail.org",
});

const router = express.Router();

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
    const artists = await fetchAllTopTracks(accessToken);
    const artistCountries = [];

    const promises = artists.map((artist) =>
      limit(() => fetchArtistCountryInfo(artist))
    );

    const results = await Promise.all(promises);

    artistCountries.push(...results);
    res.json(artistCountries);
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Access token expired" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

const fetchAllTopTracks = async (accessToken) => {
  const tracks = [];
  const limit = 50;
  let offset = 0;

  try {
    while (true) {
      const topArtists = "https://api.spotify.com/v1/me/top/artists";

      const response = await axios.get(topArtists, {
        withCredentials: true,
        params: {
          limit: limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      tracks.push(...response.data.items);

      if (tracks.length >= response.data.total) {
        break;
      }

      offset += limit;
    }

    return tracks;
  } catch (err) {
    console.error("Error fetching top tracks from Spotify", err);
  }
};

const fetchArtistCountryInfo = async (artist) => {
  try {
    const musicBrainzResponse = await mbApi.browse("artist", {
      query: artist.name,
      limit: 1,
    });

    const artistData = musicBrainzResponse.artists[0];

    if (!artistData) {
      return null;
    }

    return {
      name: artist.name,
      country: artistData.country || null,
      image: artist.images[0].url,
    };
  } catch (error) {
    console.error(`Error fetching data for artist: ${artist.name}`, error);
    return { name: artist.name, country: null };
  }
};

export default router;
