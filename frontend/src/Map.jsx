import { useState } from "react";
import axios from "axios";
function Map() {
  let [locationInfo, setLocationInfo] = useState({
    country: "",
    city: "",
  });
  let [coords, setCoords] = useState({
    lat: "",
    lng: "",
  });

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
    </div>
  );
}

export default Map;
