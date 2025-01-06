import React from "react";
import LoginButton from "./LoginButton";
import "../App.css";

const Landing = () => {
  return (
    <div className="container">
      <h1>Welcome to My Music Dashboard</h1>
      <p>
        This app allows you to see your top songs on Spotify by country. To get
        started, click the button below to log in with Spotify.
      </p>
      <LoginButton />
    </div>
  );
};
export default Landing;
