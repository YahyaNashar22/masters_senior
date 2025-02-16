import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;


const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["employee", "hr_personnel", "supervisor", "manager", "system_admin"],
            default: 'employee'
        },
        status: {
            type: String,
            required: true,
            enum: ["idle", "blocked", "active", "logged_out"],
            default: "logged_out"
        },
        supervisor_id: {
            type: Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    {
        timestamps: true
    }
);


const User = model("User", userSchema);
export default User;
