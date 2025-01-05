import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import worldGeoJSON from "../data/world.json";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [countriesList, setCountriesList] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchTopTracks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/spotify/top-songs",
        { withCredentials: true }
      );
      setCountriesList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const displayCountryInfo = async (e) => {
    const countryName = e.sourceTarget.feature.properties.name;
    setSelectedCountry(countryName);
    fetchTopSongsForCountry(countryName);
  };

  const fetchTopSongsForCountry = async (country) => {
    // fetch artists (& tracks)
  };

  const mapStyle = {
    color: "#ffffff",
    weight: 1,
    fillOpacity: 0,
    opacity: 0.7,
  };

  return (
    <div className="dashboard">
      <div className="user-info">
        <h2>Welcome, {userData?.display_name}</h2>
        <p>
          You have listened to music in {countriesList?.length} countries. Click
          on a country to see your top songs there.
        </p>
        <button onClick={fetchTopTracks}>Fetch My Top Tracks</button>
      </div>
      <div className="map-container">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh" }}>
          <TileLayer url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid25qb3JvZ2UiLCJhIjoiY201aTlsZG10MHVzNDJpczdjYTZzZmZiOCJ9.tV2G6_zvkAvHzmrK6xGKVg" />
          <GeoJSON
            data={worldGeoJSON}
            style={mapStyle}
            eventHandlers={{ click: displayCountryInfo }}
          />
        </MapContainer>
      </div>

      {/* <div className="song-info">
        <h2>Top songs listed to by you in {selectedCountry}</h2>
        {topSongs.length ? (
          <ul>
            {topSongs.map((song, index) => (
              <li key={index}>
                <strong>{song.name}</strong> by {song.artist}
                <a href={song.previewUrl} target="_blank" rel="noreferrer">
                  {" "}
                  Listen
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading songs...</p>
        )}
      </div> */}
    </div>
  );
};

export default Dashboard;
