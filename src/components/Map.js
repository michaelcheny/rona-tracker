import React, { useState, useEffect } from 'react';
import ReactMapGl, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import corona from '../assets/coronaBeer.png';
import mapMarker from '../assets/mapMarker.svg';
import loadingSvg from '../assets/loading.svg';

const Map = () => {
  // initial map configs
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    zoom: 4,
    maxZoom: 8,
    latitude: 37.7577,
    longitude: -95.712891,
  });

  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://www.trackcorona.live/api/countries');
      const data = await res.json();
      setLoading(false);
      setCountries(data.data);
      setMarkers(countries);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://www.trackcorona.live/api/provinces');
      const data = await res.json();
      setLoading(false);
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
      if (event.key === 'Escape') setSelectedMarker(null);
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  // different sets of markers on zoom change
  useEffect(() => {
    if (viewport.zoom < 3) {
      setMarkers(countries);
    } else {
      setMarkers(provinces);
    }
  }, [viewport.zoom, countries, provinces]);

  // change marker size depending on zoom level
  const markerSize = () => {
    if (viewport.zoom < 3) {
      return 'small-marker';
    } else {
      return 'med-marker';
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
      {loading ? <img className="loading" src={loadingSvg} alt="loading" /> : null}
      {markers.map((marker) => (
        <Marker
          key={marker.location + marker.country_code}
          latitude={marker.latitude}
          longitude={marker.longitude}
        >
          <button
            className={markerSize()}
            onClick={() => {
              setSelectedMarker(marker);
              setViewport({
                ...viewport,
                latitude: marker.latitude,
                longitude: marker.longitude,
                zoom: viewport.zoom < 3 ? 2.8 : 5,
                transitionInterpolator: new FlyToInterpolator({ speed: 1.6 }),
                transitionDuration: 'auto',
              });
            }}
          >
            {/* <img src={mapMarker} alt={`map marker for ${marker.location}`} /> */}
            <img src={corona} alt="corona beer" />
          </button>
        </Marker>
      ))}
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
