import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NGOSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
 name:{
    type:String,
    required:true,
 },
 email:{
    type:String,
    required:true,
    unique:true
 },
  center_point: {
    // GeoJSON structure requires a 'type' field
    type: {
      type: String,
      enum: ["Point"], // The GeoJSON type for a single location
      required: true,
      default: "Point",
    },
    // The actual coordinates array: [Longitude, Latitude]
    // NOTE: MongoDB stores coordinates as [lng, lat]
    coordinates: {
      type: [Number],
      required: true,
    },
  },
},{
    timestamps: true,
});

// Add this line after ReportSchema is defined
NGOSchema.index({ center_point: '2dsphere' });

export default NGOSchema;