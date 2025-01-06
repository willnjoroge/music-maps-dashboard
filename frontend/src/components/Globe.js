import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";

const GlobeComponent = ({
  highlightedCountries,
  isRotating,
  isInteractive,
}) => {
  const [geoJson, setGeoJson] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [clickD, setClickD] = useState();
  const globeEl = useRef();

  useEffect(() => {
    console.log(isInteractive);
    console.log(isRotating);
    // load world geojson data
    fetch("/world.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  useEffect(() => {
    const globe = globeEl.current;

    // Auto-rotate
    globe.controls().autoRotate = isRotating ? true : false;
    globe.controls().autoRotateSpeed = isRotating ? 0.35 : 0;
  }, [isInteractive, isRotating]);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={geoJson.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      )}
      polygonAltitude={(d) => (d === clickD ? 0.12 : 0.01)}
      polygonCapColor={({ properties: d }) =>
        highlightedCountries.includes(d.ISO_A2)
          ? "#1db954"
          : "rgba(200,200,200,0.3)"
      }
      polygonSideColor={() => "rgba(50,50,50,0.3)"}
      polygonStrokeColor={() => "#1db954"}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> 
      `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
      onPolygonClick={setClickD}
    />
  );
};

export default GlobeComponent;
