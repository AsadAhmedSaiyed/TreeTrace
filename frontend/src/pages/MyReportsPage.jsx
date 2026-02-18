import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react'; // Assuming you use Clerk on frontend
import { Link } from 'react-router-dom';
import axios from 'axios';
const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await getToken();
        // Make sure this URL matches your backend port
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/my-reports`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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

  if (loading) return <div>Loading your reports...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Reports</h1>
      
      {reports.length === 0 ? (
        <p>You haven't generated any reports yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            // LINK TO THE INDIVIDUAL REPORT PAGE
            <Link 
              to={`/reports/${report._id}`} 
              key={report._id}
              className="block"
            >
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                {/* Status Badge */}
                <span className={`px-2 py-1 rounded text-xs ${
                  report.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>

                <h3 className="font-semibold text-lg mt-2">{report.locationName}</h3>
                
                <div className="text-sm text-gray-500 mt-1">
                  Generated on: {new Date(report.createdAt).toLocaleDateString()}
                </div>

                <div className="mt-3 flex justify-between items-center text-sm">
                  <span>Loss: {Math.round(report.area_of_loss_m2)} m²</span>
                  <span className="text-blue-600 font-medium">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReportsPage;