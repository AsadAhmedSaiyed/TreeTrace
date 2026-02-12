function Works() {
  const steps = [
    {
      number: "01",
      title: "Select Your Area",
      description:
        "Choose the location and time period you want to analyze using our interactive map interface",
      icon: "🗺️",
      color: "from-emerald-400 to-teal-500",
    },
    {
      number: "02",
      title: "Draw Analysis Zone",
      description:
        "Draw a rectangle on the map to define the exact area for environmental monitoring",
      icon: "✏️",
      color: "from-teal-400 to-cyan-500",
    },
    {
      number: "03",
      title: "GEE Data & AI Summarization",
      description:
        "We process satellite data via Google Earth Engine and generate simple AI summaries of the results",
      icon: "🤖",
      color: "from-cyan-400 to-blue-500",
    },
    {
      number: "04",
      title: "Get Report",
      description:
        "Receive detailed environmental impact reports with visual evidence and metrics",
      icon: "📊",
      color: "from-blue-400 to-indigo-500",
    },
    {
      number: "05",
      title: "Email Alerts",
      description:
        "Get instant notifications about significant environmental changes in monitored areas",
      icon: "📧",
      color: "from-indigo-400 to-purple-500",
    },
    {
      number: "06",
      title: "Track Report Status",
      description:
        "Monitor the progress of your analysis request from Pending to Verified and finally Completed",
      icon: "✅",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <div
      id="how-it-works"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white/40"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase">
            Simple Process
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-800">
            How TreeTrace Works
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
            Five simple steps to start monitoring environmental changes with
            cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-16 h-16 bg-linear-to-br ${step.color} rounded-xl flex items-center justify-center text-3xl shadow-md`}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="text-5xl font-bold text-slate-200 mb-2">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Works;
