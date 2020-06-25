import React, { useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";

const Map = () => {
  const [viewport, setViewport] = useState({
    width: "80vh",
    height: "80vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10,
  });

  return (
    <ReactMapGl
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapStyle="mapbox://styles/proteinbro/ckbr18uqs3im51ioj2qzlgx7u"
    >
      things
    </ReactMapGl>
  );
};

export default Map;
