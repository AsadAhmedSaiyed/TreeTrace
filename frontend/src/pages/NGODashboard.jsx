import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertTriangle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Search,
} from "lucide-react";
import axios from "axios";

import ReportPageLoader from "../components/ReportPageLoader";

export default function NGODashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/my-reports`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (error) {
        console.error("Failed to load reports", error);
      }
    };

    fetchReports();
  }, [getToken]);

  // Actions: Optimistic Update with Rollback
  const handleUpdateStatus = async (id, newStatus) => {
    const previousReports = [...reports];
    
    // 1. Update UI immediately
    setReports((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );

    try {
      const token = await getToken();
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/reports/${id}`,
        { updates: { status: newStatus } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.error("Failed to update report", e);
      // 2. Rollback UI if API fails
      setReports(previousReports);
      alert("Failed to update status. Please check your connection.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "RESOLVED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const cardClass = "bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md hover:border-emerald-200";

  if (!reports) return <ReportPageLoader text="Loading reports..." />;

  // Filter Logic
  const filteredReports = reports.filter(r => {
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch = r.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mt-16 mb-10 relative min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">NGO Dashboard</h1>
            <p className="text-slate-500">Manage and verify assigned environmental reports.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
               <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{user?.publicMetadata?.role || "Verified NGO"}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Assigned</p>
                <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
              </div>
              <LayoutDashboard className="text-slate-400" size={20} />
            </div>
          </div>
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600">Pending Action</p>
                <p className="text-2xl font-bold text-amber-700">{reports.filter(r => r.status === "PENDING").length}</p>
              </div>
              <Clock className="text-amber-400" size={20} />
            </div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-600">Verified</p>
                <p className="text-2xl font-bold text-emerald-700">{reports.filter(r => r.status === "VERIFIED").length}</p>
              </div>
              <CheckCircle className="text-emerald-400" size={20} />
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">Resolved</p>
                <p className="text-2xl font-bold text-blue-700">{reports.filter(r => r.status === "RESOLVED").length}</p>
              </div>
              <ShieldCheck className="text-blue-400" size={20} />
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-xl border border-slate-200 backdrop-blur-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "PENDING", "VERIFIED", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === status 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report._id} className={cardClass}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </div>
                  
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{report.locationName}</h3>
                
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{report.center_point.coordinates[1].toFixed(4)}, {report.center_point.coordinates[0].toFixed(4)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/reports/${report._id}`)}
                    className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all"
                  >
                    View Details
                  </button>

                  {report.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(report._id, "VERIFIED")}
                      className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} /> Verify
                    </button>
                  )}

                  {report.status === "VERIFIED" && (
                    <button
                      onClick={() => handleUpdateStatus(report._id, "RESOLVED")}
                      className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-1"
                    >
                      <ShieldCheck size={14} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200 backdrop-blur-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No reports found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}