import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/spotify";

const spotifyApi = {
  fetchUserInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      withCredentials: true,
    });
    return response.data;
  },
  fetchTopTracks: async () => {
    const response = await axios.get(`${API_BASE_URL}/top-artists`, {
      withCredentials: true,
    });
    return response.data;
  },
};

export default spotifyApi;
