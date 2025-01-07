import axios from "axios";
import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
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

router.get("/callback", async (req, res) => {
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

router.get("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.spotifyRefreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const tokenUrl = "https://api.spotify.com/api/token";

    const response = await axios.get(tokenUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    });

    const { access_token } = response.data;

    res.cookie("spotifyAccessToken", access_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3600000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error(
      "Error refreshing token",
      error.response?.data || error.message
    );

    res.status(500).json({ error: "Failed to refresh token" });
  }
});

const generateRandomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default router;
