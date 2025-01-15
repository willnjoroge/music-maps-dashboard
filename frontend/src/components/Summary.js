import React from "react";

const Summary = ({ highlightedCountries }) => {
  const percentage = (highlightedCountries.length / 195) * 100;

  return (
    <div className="popup-container">
      <div className="content">
        <div className="header-container">
          <h2>Summary</h2>
        </div>

        <div>
          <p>
            Your top artists represent {highlightedCountries.length} countries.
          </p>
          <p>
            {highlightedCountries.length > 0
              ? `The countries are: ${highlightedCountries.join(", ")}`
              : ""}
          </p>
          <p>
            This is approximately {percentage.toFixed(2)}% of the world's
            countries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
