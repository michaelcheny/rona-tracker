import React, { useState, useEffect } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import corona from "../assets/coronaLogo.svg";

const Map = () => {
  // initial map configs
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "75vh",
    // latitude: 37.7577,
    // longitude: -122.4376,
    zoom: 1,
  });

  const [apiError, setApiError] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [fetched, setFetched] = useState({
    countries: false,
    provinces: false,
    cities: false,
  });

  const fetchCases = async (level = "countries") => {
    const res = await fetch(`https://www.trackcorona.live/api/${level}`);
    const data = await res.json();
    console.log(data.data);
    if (!data.code === 200) setApiError(true);
    setMarkers(data.data);
  };

  // fetch from api on app load
  useEffect(() => {
    fetchCases();
    setFetched({ countries: true });
  }, []);

  // fetch different end point on zoom change
  useEffect(() => {
    if (viewport.zoom >= 3 && viewport.zoom <= 7 && !fetched.provinces) {
      fetchCases("provinces");
      setFetched({ provinces: true, countries: false });
    } else if (viewport.zoom < 3 && !fetched.countries) {
      fetchCases();
      setFetched({ countries: true, provinces: false });
    }
    // else if (viewport.zoom > 8 && !fetched.cities) {
    //   fetchCases("cities");
    //   setFetched({ cities: true });
    // }
  }, [viewport.zoom]);

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
      // mapStyle="mapbox://styles/proteinbro/ckbr18uqs3im51ioj2qzlgx7u"
      // mapStyle="mapbox://styles/proteinbro/ckbuim9uo0iqh1ipdx8q6v199"
      mapStyle="mapbox://styles/proteinbro/ckbuivjuv0ixl1ip4uknqcbof"
    >
      <span className="zoom">Zoom: {viewport.zoom}</span>
      {!apiError
        ? markers.map((country) => (
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
