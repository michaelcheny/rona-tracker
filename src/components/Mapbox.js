import React from "react";
import ReactMapboxGl from "react-mapbox-gl";

const Mapbox = () => {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A",
  });
  return (
    <div>
      <Map style="mapbox://styles/mapbox/streets-v8" />
    </div>
  );
};

export default Mapbox;
