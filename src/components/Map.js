import React, { useState, useEffect } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import corona from "../assets/coronaLogo.svg";

const Map = () => {
  // sets initial location on map
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "75vh",
    // latitude: 37.7577,
    // longitude: -122.4376,
    zoom: 1,
  });

  const [apiError, setApiError] = useState(false);
  const [countries, setCountries] = useState([]);

  // fetch from api on app load
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://www.trackcorona.live/api/countries");
      const data = await res.json();
      console.log(data.data);
      if (!data.code === 200) setApiError(true);
      setCountries(data.data);
    };
    fetchCountries();
  }, []);

  const btnSize = () => {
    if (viewport.zoom < 3) {
      return "small-marker";
    } else if (viewport.zoom >= 3 && viewport.zoom <= 7) {
      return "med-marker";
    } else if (viewport.zoom > 7) {
      return "big-marker";
    }
  };

  return (
    <ReactMapGl
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapStyle="mapbox://styles/proteinbro/ckbr18uqs3im51ioj2qzlgx7u"
    >
      {!apiError
        ? countries.map((country) => (
            <Marker
              key={country.location + country.country_code}
              latitude={country.latitude}
              longitude={country.longitude}
            >
              <button className={btnSize()}>
                <img src={corona} alt="corona logo" />
              </button>
            </Marker>
          ))
        : null}
    </ReactMapGl>
  );
};

export default Map;
