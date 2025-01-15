import React, { useState, useEffect } from "react";
import spotifyApi from "../services/spotify";

const Header = () => {
  const [userData, setUserData] = useState(null);

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

  return (
    <div className="header-container">
      <div className="menu"></div>
      <h1>Spotify Globe</h1>
      <div className="user-profile">
        <span>Hi {userData?.display_name}</span>
      </div>
    </div>
  );
};

export default Header;
