import React from "react";
import LoginButton from "./LoginButton";
import "../App.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="content-container">
        <h1 className="title">Music Map</h1>
        <p className="description">
          Explore your top songs, artist information and music trends by
          country. Log in with Spotify to see your personalized music journey on
          the map
        </p>
        <LoginButton />
      </div>
    </div>
  );
};
export default Landing;
