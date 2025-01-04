const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/login', (req, res) => {
    const scopes = 'user-read-private playlist-read-private';
    const redirectUri = process.env.REDIRECT_URI;
    res.redirect(`https://acounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`)
})

app.get('/callback', async (req,res) => {
    const code = req.query.code;
    const tokenUrl = 'https://accounts.spotify/com/api/token';

    try {
        const response = await axios.post(
            tokenUrl,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }),{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            }
        )

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed.')
    }
})

app.get('/today-track', async (req, res) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}`}
        })

        const data = await response.json();
        const randomTrack = data.albums.items[Math.floor(Math.random() * data.albums.items.length)]
        res.json({
            name: randomTrack.name,
            artists: randomTrack.artists.map((artist) => artist.name),
            snippet: randomTrack.preview_url
        })    
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch track of today')
    }
})

app.get('/random-track', async (req, res) => {
    const { authorization } = req.headers;
    const trackIds = ['3n3Ppam8vga'];

    try {
        const trackId = trackIds[Math.floor(Math.random() * trackIds.length)]
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {Authorization: authorization }
        })

        res.json({
            name: response.data.name,
            artists: response.data.artists.map((artist) => artist.name),
            snippet: response.data.preview_url
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch random track')
    }
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))