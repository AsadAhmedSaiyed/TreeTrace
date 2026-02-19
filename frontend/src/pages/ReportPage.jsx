import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Layers,
  Activity,
  Droplets,
  Flame,
  Building2,
  AlertTriangle,
  ArrowRight,
  Leaf,
  Info,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ReportPageLoader from "../components/ReportPageLoader";
import SummaryLoader from "../components/SummaryLoader";

const ReportPage = () => {
  const [show, setShow] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ngo, setNGO] = useState(null);
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const { getToken } = useAuth();
  const [loadCount,setLoadCount] = useState(0);
  const [loadingImg, setLoadingImg] = useState(true);
  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper for Status Badge Styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "RESOLVED":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-red-100 text-red-800 border border-red-200"; // Pending or Alert
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data.report);
        setReportData(response.data.report);
      } catch (e) {
        console.error("Error fetching report : ", e);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (!reportData || !reportData.center_point) return;
    const findNearestNGO = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ngo/nearest`,
          {
            params: {
              lat: reportData.center_point.coordinates[1], // Latitude
              lng: reportData.center_point.coordinates[0], // Longitude
            },
            // Don't forget headers if this route is protected
            // headers: { Authorization: `Bearer ${token}` }
          },
        );

        const ngoDetails = response.data.ngo;
        console.log("Found Nearest NGO:", ngoDetails);
        setNGO(ngoDetails);
      } catch (error) {
        console.error("Could not find NGO:", error);
      }
    };
    findNearestNGO();
  }, [reportData]);

  if (show || !reportData) {
    return <ReportPageLoader text={"Loading report analysis..."} />;
  }
  const handleTrigger = async () => {
    if (isGenerating) return; // Prevent double clicks

    // Start Button Loader
    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reports/${id}/generate-summary`,
        {
          reportData,
          email: ngo.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (
        response.data.result.result ===
        "ANALYSIS COMPLETE: Loss detected. Alerting NGO in background."
      ) {
        console.log("updating");
        console.log(ngo.userId);
        setReportData((prev) => ({
          ...prev,
          alertSent: true,
          ngoMgrId : ngo.userId,
          result: response.data.result.result,
          summary: response.data.result.generatedSummary,
        }));
        const res = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/reports/${id}`,
          {
            updates: {
              result: response.data.result.result,
              summary: response.data.result.generatedSummary,
              alertSent: true,
              ngoMgrId: ngo.userId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("updated : ",res.data);
      } else {
        setReportData((prev) => ({
          ...prev,
          result: response.data.result.result,
          summary: response.data.result.generatedSummary,
        }));

        const res = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/reports/${id}`,
          {
            updates: {
              result: response.data.result.result,
              summary: response.data.result.generatedSummary,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
      }
    } catch (e) {
      console.error("Error fetching summary : ", e);
    } finally {
      // Stop Button Loader (Runs whether success or error)
      setIsGenerating(false);
    }
  };
  const handleImgLoad = () => {
    setLoadCount((prev) => {
      const newCount = prev + 1;
      // Check if we have reached 3 images
      if (newCount >= 3) {
        setLoadingImg(false);
      }
      return newCount;
    });
  };
  
  const cardClass =
    "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300";
  return (
    <div className="relative mt-17 mb-10 min-h-screen overflow-hidden bg-slate-50/50 font-sans text-slate-900">
      {/* Animated Blobs */}
      {loadingImg && <ReportPageLoader text={"Loading Images..."} ></ReportPageLoader>}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      {/* --- NGO ALERT BADGE --- */}
      {reportData.alertSent && (
        <div className="mt-10 ml-8 flex items-center gap-2">
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            Alert Sent To:
          </span>

          {ngo ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-semibold animate-fade-in">
              <Building2 size={14} />{" "}
              {/* Ensure Building2 is imported from lucide-react */}
              <span>{ngo.name}</span>
            </div>
          ) : (
            // Skeleton Loader while searching for NGO
            <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse" />
          )}
        </div>
      )}
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        {/* --- HEADER SECTION --- */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {reportData.locationName}
              </h1>
              {reportData.alertSent && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusStyles(reportData.status, reportData.result)}`}
                >
                  {reportData.status}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin size={16} />
              <span>
                {reportData.center_point.coordinates[1].toFixed(4)}° N,{" "}
                {reportData.center_point.coordinates[0].toFixed(4)}° E
              </span>
            </div>
          </div>

          <div className="bg-slate-50/50 px-5 py-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
              <Calendar size={16} className="text-emerald-600" />
              <span className="font-semibold">Analysis Period</span>
            </div>
            <div className="text-slate-900 font-medium">
              {formatDate(reportData.beforeDate)}{" "}
              <span className="text-slate-400 mx-1">➝</span>{" "}
              {formatDate(reportData.afterDate)}
            </div>
          </div>
        </div>

        {/* --- VISUAL EVIDENCE SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Satellite Imagery Evidence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Before Image */}
            <div className="group relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-white">
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  onLoad={handleImgLoad}
                  src={reportData.before_image}
                  alt="Before Landscape"
                  className="w-full h-full bg-slate-900 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="font-semibold text-slate-700">Before Analysis</p>
                <p className="text-xs text-slate-500">
                  {formatDate(reportData.beforeDate)}
                </p>
              </div>
            </div>

            {/* After Image */}
            <div className="group relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-white">
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  onLoad={handleImgLoad}
                  src={reportData.after_image}
                  alt="After Landscape"
                  className="w-full h-full bg-slate-900 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="font-semibold text-slate-700">After Analysis</p>
                <p className="text-xs text-slate-500">
                  {formatDate(reportData.afterDate)}
                </p>
              </div>
            </div>

            {/* Difference Map */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md border-2 border-red-100 bg-white ring-4 ring-red-50/50">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img
                 onLoad={handleImgLoad}
                  src={reportData.ndvi_diff_image}
                  alt="Vegetation Loss Heatmap"
                  className="w-full h-full bg-slate-900 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  Heatmap
                </div>
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Vegetation Loss Detected
                </p>
                <p className="text-xs text-slate-500">
                  Red areas indicate high loss
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- METRICS DASHBOARD --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Environmental Impact Metrics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Total Area Lost */}
            <div
              className={`${cardClass} border-l-4 border-l-red-500 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Area Lost
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {(reportData.area_of_loss_m2 / 10000).toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-slate-500">
                      hectares
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg text-red-500">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800">
                  What it means:
                </span>{" "}
                The total size of land where vegetation has been destroyed or
                removed.
              </p>
            </div>

            {/* 2. NDVI Change */}
            <div className={cardClass}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Vegetation Health (NDVI)
                  </h3>
                  <div
                    className={`mt-1 text-4xl font-extrabold ${reportData.mean_ndvi_change < 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {reportData.mean_ndvi_change > 0 ? "+" : ""}
                    {reportData.mean_ndvi_change.toFixed(3)}
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Leaf size={20} />
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800">
                  What it means:
                </span>{" "}
                A score of plant health. Negative numbers mean plants are dying
                or have been cut down.
              </p>
            </div>

            {/* 3. Z-Score */}
            <div className={cardClass}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Anomaly Score (Z-Score)
                  </h3>
                  <div className="mt-1 text-4xl font-extrabold text-slate-800">
                    {reportData.mean_z_score.toFixed(2)}
                  </div>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Activity size={20} />
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800">
                  What it means:
                </span>{" "}
                How "unusual" this change is. A score below -2.0 confirms this
                is not normal seasonal change.
              </p>
            </div>
          </div>

          {/* Detailed Indices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* EVI */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">
                  EVI Change
                </span>
                <span
                  className={`font-mono font-bold ${reportData.mean_evi_change < 0 ? "text-red-500" : "text-emerald-500"}`}
                >
                  {reportData.mean_evi_change.toFixed(3)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Canopy Density:</strong>{" "}
                Better than NDVI for thick forests. Detects if trees are
                thinning.
              </p>
            </div>

            {/* NDMI */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">
                    NDMI Change
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700">
                  {reportData.mean_ndmi_change.toFixed(3)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Moisture:</strong> Measures
                water in leaves. A drop means plants are drying out (drought
                stress).
              </p>
            </div>

            {/* NBR */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-sm font-bold text-slate-700">
                    NBR Change
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700">
                  {reportData.mean_nbr_change.toFixed(3)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Burn Ratio:</strong> Designed
                to find burnt areas or bare ground after a forest fire.
              </p>
            </div>

            {/* NDBI */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-gray-500" />
                  <span className="text-sm font-bold text-slate-700">
                    NDBI Change
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700">
                  {reportData.mean_ndbi_change.toFixed(3)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Built-Up:</strong> Detects
                concrete or buildings. Use this to see if forest was replaced by
                construction.
              </p>
            </div>
          </div>
        </section>

        {/* --- SUMMARY SECTION --- */}
        <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-indigo-500 to-purple-500"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Info size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              AI Analysis Summary
            </h3>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
              <p className="text-slate-700 leading-relaxed text-base">
                {reportData.summary || "No summary generated yet."}
              </p>
            </div>

            {reportData.result && (
              <>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Detailed Conclusion
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {reportData.result}
                </p>
              </>
            )}
          </div>
        </section>

        {/* --- ACTION BUTTON --- */}
        {(reportData.summary === "Pending" || !reportData.summary ) && (
          <SummaryLoader isLoading={isGenerating} onClick={handleTrigger} />
        )}
      </div>
    </div>
  );
};

export default ReportPage;
