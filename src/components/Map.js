import React, { useState, useEffect } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import corona from "../assets/coronaLogo.svg";

const Map = () => {
  // sets initial location on map
  const [viewport, setViewport] = useState({
    width: "80vh",
    height: "80vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 1,
  });

  const [fetchError, setFetchError] = useState(false);
  const [countries, setCountries] = useState([]);

  // fetch from api on app load
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://www.trackcorona.live/api/countries");
      const data = await res.json();
      console.log(data.data);
      if (!data.code === 200) setFetchError(true);
      setCountries(data.data);
    };
    fetchCountries();
  }, []);

  return (
    <ReactMapGl
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapStyle="mapbox://styles/proteinbro/ckbr18uqs3im51ioj2qzlgx7u"
    >
      {countries.map((country) => {
        // console.log(country);
        return (
          <Marker
            key={country.location + country.country_code}
            latitude={country.latitude}
            longitude={country.longitude}
          >
            <button className="marker">
              <img src={corona} alt="corona logo" />
            </button>
          </Marker>
        );
      })}
    </ReactMapGl>
  );
};

export default Map;
