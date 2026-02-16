import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Building2, Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in React
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper Component: Click to Pick Location ---
const LocationPicker = ({ setCoords }) => {
  const map = useMapEvents({
    click(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
};

const NGOFormPage = () => {
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (!coords) {
      setStatus("error");
      setErrorMessage("Please select a location on the map.");
      return;
    }

    try {
      // Construct the payload matching your Mongoose Schema
      const payload = {
        name: formData.name,
        email: formData.email,
        center_point: {
          type: "Point",
          coordinates: [coords.lng, coords.lat], // Mongo expects [Lng, Lat]
        },
      };

     let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ngo/register`, payload);
       navigate(`/ngo/${res.data.ngoId}`);
      setStatus("success");
      setFormData({ name: "", email: "" });
      setCoords(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to register NGO. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/50 font-sans text-slate-900">
      
      {/* 1. ANIMATED BACKGROUND BLOBS (Same as Landing Page) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wide border border-emerald-200 uppercase">
            Join the Network
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-900 tracking-tight">
            Register Your NGO
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Become a guardian of the green. Register your organization to receive automated deforestation alerts in your area.
          </p>
        </div>

        {/* 3. MAIN FORM CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 ring-1 ring-slate-900/5 overflow-hidden">
          
          {/* Success State */}
          {status === "success" ? (
            <div className="p-16 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
              <p className="text-slate-600 mb-8">
                Your NGO has been added to the TreeTrace network. You will now receive alerts for environmental anomalies in your vicinity.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Register Another
              </button>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <Building2 size={16} className="text-emerald-600" />
                      Organization Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInput}
                      placeholder="e.g. Green Earth Foundation"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <Mail size={16} className="text-emerald-600" />
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInput}
                      placeholder="contact@ngo.org"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Map Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <MapPin size={16} className="text-emerald-600" />
                      Headquarters Location
                    </label>
                    {coords ? (
                      <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Click on the map to pin location</span>
                    )}
                  </div>

                  <div className="relative h-80 w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner group">
                    <MapContainer
                      center={[20.5937, 78.9629]} // Center of India
                      zoom={5}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker setCoords={setCoords} />
                      {coords && <Marker position={[coords.lat, coords.lng]} />}
                    </MapContainer>
                    
                    {/* Map Hint Overlay (Disappears on interaction) */}
                    {!coords && (
                      <div className="absolute inset-0 bg-slate-900/5 pointer-events-none flex items-center justify-center z-[400]">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-slate-600">
                          👆 Click map to set location
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {status === "error" && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOFormPage;