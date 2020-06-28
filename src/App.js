import React from "react";
import "./App.scss";
import Map from "./components/Map";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="main">
      {/* <Navbar /> */}
      <h1>The Corona Tracker</h1>
      <Map />
      <p style={{ fontSize: "8px" }}>Icons by svgrepo.com</p>
    </div>
  );
};

export default App;
