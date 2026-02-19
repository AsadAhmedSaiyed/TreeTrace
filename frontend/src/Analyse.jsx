import { useState } from "react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useAuth } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";
import AnalysisLoader from "./components/AnalysisLoader";
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

function Analyse() {
  let [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  let [reportId, setReportId] = useState(null);
  const navigate = useNavigate();
  let [completed, setCompleted] = useState(false);
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
      // 🟢 FIX: We switched from Nominatim to Open-Meteo here
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        data.city,
      )}&count=1&language=en&format=json`;

      const response = await axios.get(url);

      // Open-Meteo returns data in a 'results' array
      if (response.data.results && response.data.results.length > 0) {
        return {
          lat: response.data.results[0].latitude,
          lng: response.data.results[0].longitude,
        };
      }
      return null;
    } catch (e) {
      console.error("Geocoding Error: ", e);
      return null;
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
      console.log(data);
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
    } catch (e) {
      console.error("Error in submitting coordinates : ", e);
    }
  };
  const getGeeData = async () => {
    setLoading(true);
    const token = await getToken();
    const inputData = {
      bounds: area,
      dates: {
        before: data.beforeDate,
        after: data.afterDate,
      },
      locationName: data.city,
    };
    console.log(inputData);
    console.log(data.city);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/analyze`;
      console.log(url);
      const response = await axios.post(url, inputData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setReportId(response.data.reportId);
      setCompleted(true);
    } catch (err) {
      console.error("Error while fetching GEE  data : ", err);
    } finally {
      setLoading(false); // <--- Stop Loader (This happens after 20s usually)
    }
  };

  const handleSeeReport = () => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/50">
      {loading && <AnalysisLoader />}
      {/* 1. THE LANDING PAGE BACKGROUND (Blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wide border border-emerald-200 uppercase">
            Step 1
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Define Your Analysis Zone
          </h2>
          <p className="mt-2 text-slate-500 text-lg">
            Enter the location details below to pinpoint the area you want to
            monitor.
          </p>
        </div>

        {/* 2. FORM CARD (With breathing space) */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50 ring-1 ring-slate-900/5 mb-20">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Country
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                type="text"
                name="country"
                onChange={handleInput}
                value={data.country}
                placeholder="India"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                City
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                type="text"
                name="city"
                onChange={handleInput}
                value={data.city}
                placeholder="Surat"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Start Date
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-slate-600"
                type="date"
                name="beforeDate"
                onChange={handleInput}
                value={data.beforeDate}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                End Date
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-slate-600"
                type="date"
                name="afterDate"
                onChange={handleInput}
                value={data.afterDate}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95"
            >
              Locate
            </button>
          </form>
        </div>

        {/* 3. MAP CARD (Smaller & Centered) */}
        {coords && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold border border-teal-200 uppercase">
                  Step 2
                </span>
                <span className="text-slate-600 font-medium text-sm">
                  Draw the boundary box
                </span>
              </div>
            </div>

            <div className="relative group">
              {/* Soft Glow behind map */}
              <div className="absolute -inset-4 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-50 transition duration-1000 group-hover:opacity-70" />

              {/* The Map Container - Smaller Height (450px) */}
              <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden ring-1 ring-slate-900/5">
                <MapContainer
                  center={coords}
                  zoom={5}
                  style={{ height: "450px", width: "100%" }} // <--- Reduced height here
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecenterMap coords={coords} />
                  <Marker position={coords}>
                    <Popup>Target Location</Popup>
                  </Marker>
                  <DrawControl onRectangleDrawn={handleRectangleDrawn} />
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Actions (With Breathing Space) */}
        {(area || completed) && (
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
            {area && !completed && (
              <button
                onClick={getGeeData}
                className="px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-200/50 hover:shadow-emerald-300/60 hover:-translate-y-1 transition-all"
              >
                Run Analysis 🌲
              </button>
            )}

            {completed && (
              <button
                onClick={handleSeeReport}
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm hover:border-emerald-400 hover:text-emerald-600 hover:-translate-y-1 transition-all"
              >
                View Report 📊
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyse;
