import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/save-user`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await user.reload();
      if (selectedRole === "NGO_MANAGER") {
        navigate("/ngo-form");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome to TreeTrace
          </h2>
          <p className="text-slate-600 mt-2">Choose how you want to contribute</p>
        </div>

        <div className="space-y-4">
          {/* User Option */}
          <div
            onClick={() => setSelectedRole("STANDARD_USER")}
            className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedRole === "STANDARD_USER"
                ? "border-emerald-500 bg-emerald-50 shadow-md transform scale-[1.02]"
                : "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">🌱</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Individual User</h3>
                <p className="text-slate-500 text-sm">Plant trees and track your impact</p>
              </div>
            </div>
          </div>

          {/* NGO Option */}
          <div
            onClick={() => setSelectedRole("NGO_MANAGER")}
            className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedRole === "NGO_MANAGER"
                ? "border-teal-500 bg-teal-50 shadow-md transform scale-[1.02]"
                : "border-slate-100 bg-white hover:border-teal-200 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl">🏢</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">NGO Manager</h3>
                <p className="text-slate-500 text-sm">Verify plantations and manage campaigns</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
          className="w-full mt-8 bg-linear-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Initializing Account..." : "Confirm & Continue"}
        </button>
      </div>
    </div>
  );
}