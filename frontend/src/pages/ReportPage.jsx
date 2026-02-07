import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReportView from "../components/ReportView";
const ReportPage = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);

  useEffect( () => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/report/${id}`,
        );
        console.log(response.data.report);
        setReportData(response.data.report);
      } catch (e) {
        console.error("Error fetching report", e);
      }
    };
    fetchReport();
  }, [id]);
  if (!reportData) return <div>Loading...</div>;
  return (
    <div className="report-container">
      <ReportView report={reportData} />
    </div>
  );
};

export default ReportPage;
