import React from "react";

const OverlayDashboard = ({ onFetch, isLoading }) => {
  return (
    <div className="overlay-container">
      {isLoading ? (
        <div className="loader">Loading.....</div>
      ) : (
        <button className="fetch-button" onClick={onFetch}>
          Fetch Top Artists
        </button>
      )}
    </div>
  );
};

export default OverlayDashboard;
