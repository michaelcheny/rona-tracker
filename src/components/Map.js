import React, { useState, useEffect } from "react";
import ReactMapGl, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import corona from "../assets/coronaLogo.svg";
import mapMarker from "../assets/mapMarker.svg";
import loadingSvg from "../assets/loading.svg";

const Map = () => {
  // initial map configs
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "75vh",
    // latitude: 37.7577,
    // longitude: -122.4376,
    zoom: 1.25,
    maxZoom: 8,
    // speed: 0.7,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [markers, setMarkers] = useState([]);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://www.trackcorona.live/api/countries");
      const data = await res.json();
      setLoading(false);
      if (!data.code === 200) setApiError(true);
      setCountries(data.data);
      setMarkers(data.data);
      console.log(countries);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://www.trackcorona.live/api/provinces");
      const data = await res.json();
      setLoading(false);
      if (!data.code === 200) setApiError(true);
      setProvinces(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetch from api on app load
    fetchCountries();
    fetchProvinces();

    // escape key closes popup
    const listener = (event) => {
      if (event.key === "Escape") setSelectedMarker(null);
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  // fetch different end point on zoom change
  useEffect(() => {
    if (viewport.zoom >= 3 && viewport.zoom <= 7) {
      setMarkers(provinces);
    } else if (viewport.zoom < 3) {
      setMarkers(countries);
    }
    // else if (viewport.zoom > 8 && !fetched.cities) {
    //   fetchCases("cities");
    //   setFetched({ cities: true });
    // }
  }, [viewport.zoom, countries, provinces]);

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
      // speed={viewport.speed}
    >
      ] <span className="zoom">Zoom: {viewport.zoom.toFixed(2)}</span>
      {loading ? <img className="loading" src={loadingSvg} alt="loading" /> : null}
      {!apiError && markers
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
                  setViewport({
                    ...viewport,
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    zoom: viewport.zoom < 3 ? 2.8 : 5,
                    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                    transitionDuration: "auto",
                  });
                }}
              >
                {/* <img src={corona} alt="corona logo" /> */}
                <img src={mapMarker} alt={`map marker for ${marker.location}`} />
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
          <div className="popup">
            <h3>{selectedMarker.location}</h3>
            <p>
              Confirmed: <span className="numbers">{selectedMarker.confirmed}</span>
            </p>
            {selectedMarker.recovered ? (
              <p>
                Recovered: <span className="numbers">{selectedMarker.recovered}</span>
              </p>
            ) : null}
            <p>
              Dead: <span className="numbers">{selectedMarker.dead}</span>
            </p>
          </div>
        </Popup>
      ) : null}
    </ReactMapGl>
  );
};

export default Map;
