import React from "react";
import EarthquakeMap from "./EarthquakeMap";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        🌍 Earthquake Visualizer
      </h1>
      <EarthquakeMap />
    </div>
  );
}

export default App;
