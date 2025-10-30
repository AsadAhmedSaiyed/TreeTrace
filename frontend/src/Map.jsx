import { useState } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import axios from "axios";
import DrawControl from "./DrawControl";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

function RecenterMap({coords}){
  const map = useMap();
  if(coords){
    map.setView(coords,13);
  }
  return null;
}

function Map() {
  let [locationInfo, setLocationInfo] = useState({
    country: "",
    city: "",
  });
  let [coords, setCoords] = useState(null);
  const handleRectangleDrawn = (bounds)=>{
    console.log("Selected area : ", bounds);
  }
  const getCoordinates = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      const response = await axios.get(url);
      console.log(response);
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
    setLocationInfo((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!locationInfo.city || !locationInfo.country) {
      return alert("Please enter details!");
    }
    try {
      const coordinates = await getCoordinates(
        `${locationInfo.city}, ${locationInfo.country}`
      );
      console.log(coordinates);
      if (coordinates) {
        setCoords({
          lat: coordinates.lat,
          lng: coordinates.lng,
        });
      } else {
        alert("No coordinates found!");
      }
      setLocationInfo({
        country: "",
        city: "",
      });
    } catch (e) {
      console.error("Error in submitting coordinates : ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="country"
          onChange={handleInput}
          value={locationInfo.country}
          placeholder="Enter country"
        />
        <input
          type="text"
          name="city"
          onChange={handleInput}
          value={locationInfo.city}
          placeholder="Enter city"
        />
        <button>Get map</button>
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
             <Popup>
               You are here!
             </Popup>
          </Marker>
          <DrawControl onRectangleDrawn={handleRectangleDrawn}></DrawControl>
        </MapContainer>
      )}
    </div>
  );
}

export default Map;
