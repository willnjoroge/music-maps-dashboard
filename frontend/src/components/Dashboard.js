import React, { useState } from "react";
import GlobeComponent from "./Globe";
import spotifyApi from "../services/spotify";
import "../App.css";
import CountryInfo from "./CountryInfo";
import Header from "./Header";
import OverlayDashboard from "./OverlayDashboard";
import Summary from "./Summary";

const Dashboard = () => {
  const [artistsData, setArtistsData] = useState([]);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [pointOfView, setPointOfView] = useState({
    lat: 0,
    lng: 0,
    altitude: 2.5,
  });

  const fetchTopArtists = async () => {
    setArtistsData([]);
    setHighlightedCountries([]);
    setIsRotating(true);
    setIsInteractive(false);

    try {
      const response = await spotifyApi.fetchTopArtists();
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
      const countryProperties = country.properties;
      const selectedInfo = {
        countryName: countryProperties.NAME,
        countryCode: countryProperties.ISO_A2,
        items: artistsData.filter(
          (artist) => artist.country === countryProperties.ISO_A2
        ),
      };
      setSelectedCountry(selectedInfo);
      console.log(selectedCountry);

      const lat = (country.bbox[1] + country.bbox[3]) / 2;
      const lng = (country.bbox[0] + country.bbox[2]) / 2;
      // TO DO: set altitude based on bounding box

      setPointOfView({
        lat: lat,
        lng: lng,
        altitude: 1,
      });
    } else {
      setSelectedCountry(null);
      setPointOfView({
        ...pointOfView,
        altitude: 1.5,
      });
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="globe-container">
        {!artistsData.length && (
          <OverlayDashboard onFetch={fetchTopArtists} isLoading={isRotating} />
        )}

        {selectedCountry ? (
          <CountryInfo
            selectedCountry={selectedCountry}
            returnToMap={displayCountryInfo}
          />
        ) : (
          <Summary highlightedCountries={highlightedCountries} />
        )}

        <GlobeComponent
          highlightedCountries={highlightedCountries}
          isRotating={isRotating}
          isInteractive={isInteractive}
          pointOfView={pointOfView}
          onPolygonClick={displayCountryInfo}
          selectedCountry={selectedCountry}
        />
      </div>
    </div>
  );
};

export default Dashboard;
