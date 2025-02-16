import mongoose from "mongoose";

const { Schema, model } = mongoose;


const escalationRequestSchema = new Schema(
    {
        task_id: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        requested_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        approved_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
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
    },
    {
        timestamps: true
    }
);


const EscalationRequest = model("EscalationRequest", escalationRequestSchema);
export default EscalationRequest;
