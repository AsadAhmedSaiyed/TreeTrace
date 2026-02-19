import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
function CTA() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const handleGetStarted = () => {
    window.scrollTo(0,0);
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
    <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJhMjggMjggMCAwIDEgMC01NnYyYTI2IDI2IDAgMCAwIDAgNTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Join thousands monitoring and protecting our planet's forests with
              TreeTrace
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-50 transition-colors"
            >
              Start Monitoring Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
