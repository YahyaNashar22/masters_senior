import mongoose from "mongoose";

const { Schema, model } = mongoose;


const changePasswordSchema = new Schema(
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
    },
    {
        timestamps: true
    }
);


const ChangePassword = model("ChangePassword", changePasswordSchema);
export default ChangePassword;
