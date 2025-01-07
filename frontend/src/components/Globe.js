import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";

const GlobeComponent = ({
  highlightedCountries,
  isRotating,
  isInteractive,
  onPolygonClick,
}) => {
  const [geoJson, setGeoJson] = useState({ features: [] });
  const [clickD, setClickD] = useState();
  const globeEl = useRef();

  useEffect(() => {
    // load world geojson data
    fetch("/world.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  useEffect(() => {
    const globe = globeEl.current;

    // Auto-rotate
    globe.controls().autoRotate = isRotating ? true : false;
    globe.controls().autoRotateSpeed = isRotating ? 5 : 0;
  }, [isInteractive, isRotating]);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={geoJson.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      )}
      polygonAltitude={({ properties: d }) =>
        d.ISO_A2 === clickD ? 0.12 : 0.01
      }
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
      polygonsTransitionDuration={300}
      onPolygonClick={({ properties: d }) => {
        if (d.ISO_A2 === clickD) {
          setClickD(null);
          onPolygonClick(null);
        } else {
          setClickD(d.ISO_A2);
          onPolygonClick(d);
        }
      }}
      enablePointerInteraction={isInteractive}
    />
  );
};

export default GlobeComponent;
