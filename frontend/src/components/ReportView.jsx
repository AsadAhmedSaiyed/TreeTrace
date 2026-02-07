
const ReportView = ({ report }) => {
  if (!report) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg animate-pulse">
        Loading Report Data...
      </div>
    );
  }

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Helper for Status Badge Styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'RESOLVED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-red-100 text-red-800 border border-red-200'; // Pending or Alert
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 font-sans min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {report.locationName}
          </h1>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusStyles(report.status)}`}>
            {report.status}
          </span>
        </div>
        <div className="mt-4 md:mt-0 text-right space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Coordinates:</span> {report.center_point.coordinates[1].toFixed(4)}° N, {report.center_point.coordinates[0].toFixed(4)}° E
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Analysis Period:</span> {formatDate(report.beforeDate)} ➝ {formatDate(report.afterDate)}
          </p>
        </div>
      </div>

      {/* --- VISUAL EVIDENCE SECTION --- */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
          Satellite Imagery Evidence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 w-full h-64 overflow-hidden rounded-lg bg-gray-100">
              <img src={report.before_image} alt="Before Landscape" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-sm font-medium text-center text-gray-600">
              Before ({formatDate(report.beforeDate)})
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="aspect-w-16 aspect-h-9 w-full h-64 overflow-hidden rounded-lg bg-gray-100">
              <img src={report.after_image} alt="After Landscape" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-sm font-medium text-center text-gray-600">
              After ({formatDate(report.afterDate)})
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ring-2 ring-red-50">
             <div className="aspect-w-16 aspect-h-9 w-full h-64 overflow-hidden rounded-lg bg-gray-100">
              <img src={report.ndvi_diff_image} alt="Vegetation Loss Heatmap" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-sm font-bold text-center text-red-600 flex justify-center items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Vegetation Loss Heatmap
            </p>
          </div>
        </div>
      </div>

      {/* --- METRICS DASHBOARD --- */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-blue-500 mr-3 rounded-full"></span>
          Environmental Impact Metrics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric: Area Lost */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Area Lost</h3>
            <p className="text-3xl font-extrabold text-gray-900">
              {(report.area_of_loss_m2 / 10000).toFixed(2)} <span className="text-lg font-medium text-gray-500">ha</span>
            </p>
            <p className="text-xs text-red-500 mt-2 font-medium">
              ≈ {Math.round(report.area_of_loss_m2).toLocaleString()} m² detected
            </p>
          </div>

          {/* Metric: NDVI Change */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vegetation Health (NDVI)</h3>
            <p className={`text-3xl font-extrabold ${report.mean_ndvi_change < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {report.mean_ndvi_change > 0 ? '+' : ''}{report.mean_ndvi_change.toFixed(3)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Negative values indicate loss of greenness density.
            </p>
          </div>

          {/* Metric: Z-Score */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Anomaly Score (Z-Score)</h3>
            <p className="text-3xl font-extrabold text-gray-800">
              {report.mean_z_score.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Scores below <span className="font-bold text-gray-600">-2.0</span> are statistically significant anomalies.
            </p>
          </div>

          {/* Secondary Metrics List */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">Detailed Indices</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">EVI Change:</span>
                <span className="font-semibold text-gray-700">{report.mean_evi_change.toFixed(3)}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">Moisture (NDMI):</span>
                <span className="font-semibold text-gray-700">{report.mean_ndmi_change.toFixed(3)}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">Burn/Structure:</span>
                <span className="font-semibold text-gray-700">{report.mean_nbr_change.toFixed(3)}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">Built-up (NDBI):</span>
                <span className="font-semibold text-gray-700">{report.mean_ndbi_change.toFixed(3)}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- SUMMARY SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          AI Analysis Summary
        </h3>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {report.summary || "No summary generated yet."}
        </p>
      </div>

    </div>
  );
};

export default ReportView;