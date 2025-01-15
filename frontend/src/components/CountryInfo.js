import React from "react";

const CountryInfo = ({ selectedCountry, returnToMap }) => {
  return (
    <div className="country-container">
      <button onClick={() => returnToMap(null)}>X</button>
      <div className="country">
        <div className="header-container">
          <h2>Top artists listed to by you in {selectedCountry.countryName}</h2>
        </div>
        <ul className="artists-list">
          {selectedCountry.items.map((item, index) => (
            <div className="artist-info" key={index}>
              <img className="artist-image" src={item.image} alt=""></img>
              <span>{item.name}</span>
            </div>
          ))}
        </ul>{" "}
      </div>
    </div>
  );
};

export default CountryInfo;
