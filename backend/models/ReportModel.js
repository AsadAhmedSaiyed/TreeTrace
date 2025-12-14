import mongoose, { mongo } from "mongoose";
import ReportSchema from "../schemas/ReportSchema";

const ReportModel = mongoose.model("Report",ReportSchema);

export default ReportModel;