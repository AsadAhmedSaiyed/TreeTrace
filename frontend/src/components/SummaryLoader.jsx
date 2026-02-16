
import { Loader2, ArrowRight } from "lucide-react";

const SummaryLoader = ({ isLoading, onClick }) => {
  return (
    <div className="flex justify-center pt-4 pb-12">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 rounded-xl shadow-lg 
        ${
          isLoading
            ? "bg-slate-700 cursor-not-allowed opacity-80"
            : "bg-slate-900 hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span>Generate AI Summary</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};

export default SummaryLoader;