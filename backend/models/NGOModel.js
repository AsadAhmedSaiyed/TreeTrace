import mongoose from "mongoose";
import NGOSchema from "../schemas/NgoSchema";

const NGOModel = mongoose.model("NGO",NGOSchema);

export default NGOModel;