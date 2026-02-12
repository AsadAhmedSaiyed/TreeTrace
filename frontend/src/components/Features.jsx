function Features() {
    const features = [
    {
      title: 'For Organizations',
      description: 'Define precise project boundaries on the map to monitor large-scale tree cover loss. Access professional-grade GEE data and detailed AI technical reports.',
      icon: '🏢', 
      benefits: ['Custom Boundary Mapping', 'Advanced Loss Analytics', 'Technical Impact Reports']
    },
    {
      title: 'For Public',
      description: 'Select any area on the map to instantly check local tree loss trends. Get simplified, easy-to-understand AI summaries about the environment near you.',
      icon: '🌍', 
      benefits: ['Interactive Map Selection', 'Local Loss Insights', 'Simple AI Summaries']
    }
  ];
    return ( 
      <div id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold text-sm tracking-wide uppercase">
              Powerful Tools for All
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white">
              Map, Analyze, Act
            </h2>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Whether you are managing a forest or checking your backyard, simply select an area to get AI-powered environmental insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-2xl p-10 shadow-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed text-lg">{feature.description}</p>
                
                <ul className="space-y-4">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-300 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
     );
}

export default Features;