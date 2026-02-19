import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Leaf,
  FileText,
} from "lucide-react";
import ReportPageLoader from "../components/ReportPageLoader";

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper for Status Badge Styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "RESOLVED":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border border-amber-200";
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/my-reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [getToken]);

  if (loading) {
    return <ReportPageLoader text={"Loading Reports..."} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/50 font-sans text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      {/* --- Animated Background Blobs (Green/Teal/Cyan Only) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 mt-16">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="text-emerald-600" size={32} />
              My Reports
            </h1>
            <p className="mt-2 text-slate-500">
              Track and manage your environmental impact analysis reports.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
            Total Reports: <span className="text-slate-900 font-bold">{reports.length}</span>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="p-4 bg-emerald-50 rounded-full mb-4">
              <Leaf className="text-emerald-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No Reports Found</h3>
            <p className="text-slate-500 mt-2 max-w-md">
              You haven't generated any reports yet. Start by analyzing a location to see your reports here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                to={`/reports/${report._id}`}
                key={report._id}
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-1">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {report.locationName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <span>ID:</span>
                        <span className="font-mono">{report._id.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                  {report.alertSent && (
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(
                        report.status || "PENDING"
                      )}`}
                    >
                      {report.status || "PENDING"}
                    </span>
                  )}
                </div>

                <hr className="border-slate-100 my-4" />

                {/* Card Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span>Generated</span>
                    </div>
                    <span className="font-medium text-slate-700">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <AlertTriangle size={14} className={report.area_of_loss_m2 > 0 ? "text-red-400" : "text-slate-400"} />
                      <span>Vegetation Loss</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.round(report.area_of_loss_m2).toLocaleString()} m²
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
                  View Analysis
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReportsPage;