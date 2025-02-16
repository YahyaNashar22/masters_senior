import mongoose from "mongoose";

const { Schema, model } = mongoose;


const leaveRequestSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
            required: true,
        },
        from: {
            type: String,
            required: false,
        },
        to: {
            type: String,
            required: false,
        },
        full_day: {
            type: Boolean,
            required: false,
        },
    },
    {
        timestamps: true
    }
);


const LeaveRequest = model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
