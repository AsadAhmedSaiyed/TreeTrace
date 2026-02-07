import { useState } from "react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import DrawControl from "./DrawControl";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

function RecenterMap({ coords }) {
  const map = useMap();
  if (coords) {
    map.setView(coords, 13);
  }
  return null;
}

function Map() {
  let [reportId, setReportId] = useState(null);
  const navigate = useNavigate();
  let [completed,setCompleted] = useState(false);
  let [data, setData] = useState({
    country: "",
    city: "",
    beforeDate: "",
    afterDate: "",
  });
  let [area, setArea] = useState(null);
  let [coords, setCoords] = useState(null);
  const handleRectangleDrawn = (bounds) => {
    const newArea = {
      _northEast: { lat: bounds._northEast.lat, lng: bounds._northEast.lng },
      _southWest: { lat: bounds._southWest.lat, lng: bounds._southWest.lng },
    };
    console.log("Selected area : ", newArea);
    setArea(newArea);
  };
  const getCoordinates = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address,
      )}`;
      const response = await axios.get(url);
      const data = response.data;
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (e) {
      console.error("Error in Nominatim API : ", e);
    }
  };

  const handleInput = (event) => {
    setData((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.city || !data.country || !data.beforeDate || !data.afterDate) {
      return alert("Please enter details!");
    }
    try {
      const coordinates = await getCoordinates(`${data.city}, ${data.country}`);
      console.log(coordinates);
      if (coordinates) {
        setCoords({
          lat: coordinates.lat,
          lng: coordinates.lng,
        });
      } else {
        alert("No coordinates found!");
      }
      console.log(data);
    } catch (e) {
      console.error("Error in submitting coordinates : ", e);
    }
  };
  const getGeeData = async () => {
    const inputData = {
      bounds: area,
      dates: {
        before: data.beforeDate,
        after: data.afterDate,
      },
      locationName:data.city
    };
    console.log(inputData);
    console.log(data.city);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/analyze`;
      const response = await axios.post(url, inputData);
      console.log(response.data);
      setReportId(response.data.reportId);
      setCompleted(true);
    } catch (err) {
      console.error("Error while fetching GEE  data : ", err);
    }
  };

  const handleSeeReport = () =>{
    navigate(`/report/${reportId}`);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          name="country"
          onChange={handleInput}
          value={data.country}
          placeholder="Enter country"
        />
        <input
          type="text"
          name="city"
          onChange={handleInput}
          value={data.city}
          placeholder="Enter city"
        />
        <input
          type="date"
          name="beforeDate"
          onChange={handleInput}
          value={data.beforeDate}
          placeholder="Enter before date"
        />
        <input
          type="date"
          name="afterDate"
          onChange={handleInput}
          value={data.afterDate}
          placeholder="Enter after date"
        />
        <button onClick={handleSubmit}>Get map</button>
      </form>

      {coords && (
        <MapContainer
          center={coords}
          zoom={5}
          style={{ height: "500px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap coords={coords}></RecenterMap>

          <Marker position={coords}>
            <Popup>You are here!</Popup>
          </Marker>
          <DrawControl onRectangleDrawn={handleRectangleDrawn}></DrawControl>
        </MapContainer>
      )}
      {area && <button onClick={getGeeData}>Check tree loss</button>}
      <br />
      {completed && <button onClick={handleSeeReport}>see report</button>}
    </div>
  );
}

export default Map;
