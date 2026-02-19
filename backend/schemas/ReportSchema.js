import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true
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
  locationName :{
    type:String,
    required:true
  },
  status: {
    type: String,
    default: "PENDING",
    enum: ["RESOLVED", "PENDING", "VERIFIED"],
  },
  ngoMgrId: {
    type: Schema.Types.ObjectId,
    ref: "NGO",
  },
  beforeDate: {
    type: Date,
    required: true,
  },
  afterDate: {
    type: Date,
    required: true,
  },
  before_image: {
    type: String,
    required: true,
  },
  after_image: {
    type: String,
    required: true,
  },
  ndvi_diff_image: {
    type: String,
    required: true,
  },
  mean_ndvi_change: {
    type: Number,
    required: true,
  },
  mean_evi_change: {
    type: Number,
    required: true,
  },
  mean_ndmi_change: {
    type: Number,
    required: true,
  },
  mean_ndbi_change: {
    type: Number,
    required: true,
  },
  mean_nbr_change: {
    type: Number,
    required: true,
  },
  mean_z_score: {
    type: Number,
    required: true,
  },
  historical_baseline_mu: {
    type: Number,
    required: true,
  },
  historical_variability_sigma: {
    type: Number,
    required: true,
  },
  area_of_loss_m2: {
    type: Number,
    required: true,
  },
  summary:{
    type:String,
    default: "Pending"
  },
  result: {
    type: String,
    default: "Pending"
  },
  alertSent : {
    type:Boolean,
    default:false,
    required:true
  }
},{
    timestamps: true,
});

// Add this line after ReportSchema is defined
ReportSchema.index({ center_point: '2dsphere' });

export default ReportSchema;