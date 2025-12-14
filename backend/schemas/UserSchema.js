import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
   username:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   ngoId: {
        type: Schema.Types.ObjectId,
        ref: "NGO",
    },
    timestamps: true,
    role: {
        type: String,
        required: true,
        default: 'STANDARD_USER',
        enum: ['STANDARD_USER', 'NGO_MANAGER'],
    },
});


export default UserSchema;