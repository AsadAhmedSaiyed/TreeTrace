import mongoose from "mongoose";
import ReportSchema from "../schemas/ReportSchema.js";

const ReportModel = mongoose.model("Report",ReportSchema);

export default ReportModel;