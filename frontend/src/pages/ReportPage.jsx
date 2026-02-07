import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReportView from "../components/ReportView";
const ReportPage = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [trigger,setTrigger] = useState(null);
  useEffect( () => {
    
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/${id}`,
        );
        console.log(response.data.report);
        setReportData(response.data.report);
        setTrigger(true);
      } catch (e) {
        console.error("Error fetching report : ", e);
      }
    };
    fetchReport();
  }, [id]);
  if (!reportData) return <div>Loading...</div>;
  const handleTrigger = async () =>{
    try{
        const start = Date.now();
        console.log(reportData);
       const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reports/${id}/generate-summary`,{
        reportData,
        email : "asadahmedsaiyed786@gmail.com",
       });
       console.log("Line 33",response.data);
       console.log(Date.now()-start);
    }catch(e){
        console.error("Error fetching summary : ", e);
    }
  };
  return (
    <div className="report-container">
      <ReportView report={reportData} />
      {trigger && <button onClick={handleTrigger}>Get AI summary</button>}
    </div>
  );
};

export default ReportPage;
