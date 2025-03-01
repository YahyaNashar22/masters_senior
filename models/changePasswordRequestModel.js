import mongoose from "mongoose";

const { Schema, model } = mongoose;


const changePasswordSchema = new Schema(
    {
        email: {
            type: String,
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
    },
    {
        timestamps: true
    }
);


const ChangePasswordRequest = model("ChangePasswordRequest", changePasswordSchema);
export default ChangePasswordRequest;
