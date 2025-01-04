const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const spotifyRoutes = require("./routes/spotifyRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/spotify", spotifyRoutes);

app.get("/login", (req, res) => {
  const scopes = "user-read-private playlist-read-private";
  const redirectUri = process.env.REDIRECT_URI;
  res.redirect(
    `https://acounts.spotify.com/authorize?response_type=code&client_id=${
      process.env.SPOTIFY_CLIENT_ID
    }&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const tokenUrl = "https://accounts.spotify/com/api/token";

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed.");
  }
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
