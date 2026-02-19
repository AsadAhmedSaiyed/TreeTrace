
import { Loader2 } from "lucide-react";

const ReportPageLoader = ({text}) => {
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      
      <div className="z-10 flex flex-col items-center gap-4">
        {/* Spinning Loader */}
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ReportPageLoader;