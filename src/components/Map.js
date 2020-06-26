import React, { useState, useEffect } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
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

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [fetched, setFetched] = useState({
    countries: false,
    provinces: false,
    cities: false,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);

  const fetchCases = async (level = "countries") => {
    setLoading(true);
    const res = await fetch(`https://www.trackcorona.live/api/${level}`);
    const data = await res.json();
    console.log(data.data);
    setLoading(false);
    if (!data.code === 200) setApiError(true);
    setMarkers(data.data);
  };

  // fetch from api on app load
  useEffect(() => {
    fetchCases();
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
  }, [viewport.zoom, fetched.countries, fetched.provinces]);

  const markerSize = () => {
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
      mapStyle={process.env.REACT_APP_MAPBOX_MAPSTYLE}
    >
      <span className="zoom">Zoom: {viewport.zoom.toFixed(2)}</span>
      {loading ? <span className="loading">FETCHING</span> : null}
      {!apiError
        ? markers.map((marker) => (
            <Marker
              key={marker.location + marker.country_code}
              latitude={marker.latitude}
              longitude={marker.longitude}
            >
              <button
                className={markerSize()}
                onClick={(event) => {
                  event.preventDefault();
                  console.log(marker);
                  setSelectedMarker(marker);
                }}
              >
                <img src={corona} alt="corona logo" />
              </button>
            </Marker>
          ))
        : null}
      {selectedMarker ? (
        <Popup
          latitude={selectedMarker.latitude}
          longitude={selectedMarker.longitude}
          onClose={() => setSelectedMarker(null)}
        >
          <div>askdjfhjkasdfjsdf</div>
        </Popup>
      ) : null}
    </ReactMapGl>
  );
};

export default Map;
