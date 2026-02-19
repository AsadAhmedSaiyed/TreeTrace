import { HashLink } from "react-router-hash-link";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const handleGetStarted = () => {
    window.scrollTo(0, 0);
    if (isSignedIn) {
      if (user.publicMetadata?.role == "STANDARD_USER") {
        navigate("/analyse");
      } else {
        navigate("/ngo/dashboard");
      }
    } else {
      navigate("/sign-in");
    }
  };
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold tracking-wide border border-emerald-200">
                  Powered by AI & Satellite Imagery
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  TreeTrace
                </span>
                <br />
                <span className="text-slate-900">Monitor Green Cover</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Advanced satellite imagery analysis to track vegetation changes,
                verify environmental campaigns, and protect our forests with
                precision AI technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Get Started
                </button>

                <HashLink
                  smooth
                  to={"/#how-it-works"}
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  Learn More
                </HashLink>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">99%</div>
                  <div className="text-sm text-slate-600 font-medium">
                    Accuracy
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">24/7</div>
                  <div className="text-sm text-slate-600 font-medium">
                    Monitoring
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-600">AI</div>
                  <div className="text-sm text-slate-600 font-medium">
                    Powered
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-teal-500/20 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                  alt="Satellite Forest Monitoring"
                  className="w-full h-auto"
                />
              </div>

              {/* Static floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
                    🌲
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Live Tracking
                    </div>
                    <div className="text-sm text-slate-600">
                      Real-time Updates
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl">
                    📡
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Satellite Data
                    </div>
                    <div className="text-sm text-slate-600">
                      High Resolution
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
