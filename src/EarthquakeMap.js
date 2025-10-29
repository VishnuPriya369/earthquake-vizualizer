import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        if (!res.ok) throw new Error("Failed to fetch earthquake data");
        const data = await res.json();
        setEarthquakes(data.features);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading earthquakes...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {earthquakes.map((eq) => {
          const [lon, lat, depth] = eq.geometry.coordinates;
          const { place, mag, time } = eq.properties;
          const date = new Date(time).toLocaleString();
          return (
            <Marker key={eq.id} position={[lat, lon]}>
              <Popup>
                <b>{place || "Unknown Location"}</b>
                <br />
                Magnitude: {mag}
                <br />
                Depth: {depth} km
                <br />
                Time: {date}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
