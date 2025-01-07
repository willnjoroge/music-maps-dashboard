import React from "react";

const CountryInfo = ({ selectedCountry }) => {
  return (
    <div className="country-info">
      <h2>Top artists listed to by you in {selectedCountry.countryName}</h2>
      <ul>
        {selectedCountry.items.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt=""></img>
            <span>{item.name}</span>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CountryInfo;
