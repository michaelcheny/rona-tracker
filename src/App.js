import React from "react";
import "./App.scss";
import Map from "./components/Map";

const App = () => {
  return (
    <div className="main">
      <h1>The Corona Tracker 1.0</h1>
      <Map />
      <p style={{ fontSize: "8px" }}>Icons by svgrepo.com</p>
    </div>
  );
};

export default App;
