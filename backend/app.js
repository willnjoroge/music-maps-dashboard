const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const spotifyRoutes = require("./routes/spotifyRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/spotify", spotifyRoutes);

app.get("/login", (req, res) => {
  const scopes = "user-read-private playlist-read-private user-top-read";

  const state = generateRandomString(16);

  const authQueryParameters = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: process.env.REDIRECT_URI,
    state: state,
  });

  res.redirect(
    `https://accounts.spotify.com/authorize?${authQueryParameters.toString()}`
  );
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
      },
    });

    const { access_token, refresh_token } = response.data;

    res.cookie("spotifyAccessToken", access_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3600000,
    });

    res.cookie("spotifyRefreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3600000,
    });

    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed.");
  }
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

const generateRandomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
