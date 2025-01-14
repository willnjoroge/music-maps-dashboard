import React, { useState } from "react";
import GlobeComponent from "./Globe";
import spotifyApi from "../services/spotify";
import "../App.css";
import CountryInfo from "./CountryInfo";
import Header from "./Header";
import OverlayDashboard from "./OverlayDashboard";

const Dashboard = () => {
  const [artistsData, setArtistsData] = useState([]);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);

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
      setSelectedCountry(selectedInfo);
    } else {
      setSelectedCountry(null);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="globe-container">
        {!artistsData.length && (
          <OverlayDashboard onFetch={fetchTopTracks} isLoading={isRotating} />
        )}
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
