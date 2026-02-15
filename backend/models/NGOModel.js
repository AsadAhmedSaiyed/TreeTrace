import mongoose from "mongoose";
import NGOSchema from "../schemas/NGOSchema.js";

const NGOModel = mongoose.model("NGO",NGOSchema);

export default NGOModel;