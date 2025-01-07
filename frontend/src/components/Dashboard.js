import React, { useState, useEffect } from "react";
import GlobeComponent from "./Globe";
import spotifyApi from "../services/spotify";
import "../App.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await spotifyApi.fetchUserInfo();
        setUserData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const fetchTopTracks = async () => {
    setHighlightedCountries([]);
    setIsRotating(true);
    setIsInteractive(false);

    try {
      const response = await spotifyApi.fetchTopTracks();
      const countries = response.map((artist) => artist.country);
      setHighlightedCountries(countries);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRotating(false);
      setIsInteractive(true);
    }
  };

  const displayCountryInfo = async (country) => {
    console.log(country);
    const countryName = country.name;
    setSelectedCountry(countryName);
    fetchTopSongsForCountry(countryName);
  };

  const fetchTopSongsForCountry = async (country) => {
    // fetch artists (& tracks)
  };

  return (
    <div className="dashboard">
      <div className="user-info">
        {/* <img src={userData?.}></img> */}
        <div>
          <h2>{userData?.display_name}</h2>
          <p>{userData?.email}</p>
        </div>
        <p>
          You have listened to artists from {highlightedCountries.length}{" "}
          countries. Click on a country to see your top songs there.
        </p>
        <button onClick={fetchTopTracks}>Fetch My Top Tracks</button>
      </div>
      <div className="globe-container">
        <GlobeComponent
          highlightedCountries={highlightedCountries}
          isRotating={isRotating}
          isInteractive={isInteractive}
        />
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
