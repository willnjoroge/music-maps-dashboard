import React, { useState, useEffect } from "react";
import GlobeComponent from "./Globe";
import spotifyApi from "../services/spotify";
import "../App.css";
import CountryInfo from "./CountryInfo";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [artistsData, setArtistsData] = useState([]);
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
    setArtistsData([]);
    setHighlightedCountries([]);
    setIsRotating(true);
    setIsInteractive(false);

    try {
      const response = await spotifyApi.fetchTopTracks();
      setArtistsData(response);
      const countries = [...new Set(response.map((artist) => artist.country))];
      setHighlightedCountries(countries);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRotating(false);
      setIsInteractive(true);
    }
  };

  const displayCountryInfo = async (country) => {
    if (country) {
      const selectedInfo = {
        countryName: country.NAME,
        countryCode: country.ISO_A2,
        items: artistsData.filter(
          (artist) => artist.country === country.ISO_A2
        ),
      };
      console.log(selectedInfo);
      setSelectedCountry(selectedInfo);
    } else {
      setSelectedCountry(null);
    }
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
          onPolygonClick={displayCountryInfo}
        />
      </div>

      {selectedCountry && <CountryInfo selectedCountry={selectedCountry} />}
    </div>
  );
};

export default Dashboard;
