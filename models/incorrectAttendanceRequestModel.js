import mongoose from "mongoose";

const { Schema, model } = mongoose;


const incorrectAttendanceSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
            required: true,
        },
        approved_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);


const IncorrectAttendanceRequest = model("IncorrectAttendanceRequest", incorrectAttendanceSchema);
export default IncorrectAttendanceRequest;
