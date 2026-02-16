import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Satellite, 
  Cpu, 
  History, 
  Flame, 
  FileCheck, 
  Loader2 
} from "lucide-react";

const loadingSteps = [
  {
    text: "Establishing uplink with Sentinel-2 Satellite Constellation...",
    subtext: "Querying Copernicus Hub for region bounds",
    icon: Satellite,
    duration: 3000, // 0-3s
  },
  {
    text: "Retrieving & Filtering Optical Imagery...",
    subtext: "Applying Cloud Masking (SCL Band) & Atmospheric Correction",
    icon: Loader2,
    duration: 4000, // 3-7s
  },
  {
    text: "Computing Vegetation Indices...",
    subtext: "Calculating NDVI, EVI (Greenness) & NDMI (Moisture)",
    icon: Cpu,
    duration: 4000, // 7-11s
  },
  {
    text: "Running Historical Analysis...",
    subtext: "Fetching 2-Year Baseline (µ) & Variability (σ)",
    icon: History,
    duration: 4000, // 11-15s
  },
  {
    text: "Detecting Anomalies & Loss...",
    subtext: "Calculating Z-Scores & NBR (Burn Ratio) Deltas",
    icon: Flame,
    duration: 3000, // 15-18s
  },
  {
    text: "Finalizing Report...",
    subtext: "Generating visual layers & uploading to database",
    icon: FileCheck,
    duration: 2000, // 18-20s
  },
];

export default function AnalysisLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timer;
    if (currentStep < loadingSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, loadingSteps[currentStep].duration);
    }
    return () => clearTimeout(timer);
  }, [currentStep]);

  const StepIcon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-slate-100 text-center">
        
        {/* Animated Icon Ring */}
        <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          <motion.div
            key={currentStep}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative z-10 text-emerald-600"
          >
            <StepIcon size={40} />
          </motion.div>
        </div>

        {/* Text Animations */}
        <div className="h-24"> {/* Fixed height to prevent layout jumps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <h3 className="text-xl font-bold text-slate-800">
                {loadingSteps[currentStep].text}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {loadingSteps[currentStep].subtext}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 mt-6 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="mt-4 text-xs text-slate-400 font-mono">
          Process ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
}