import mongoose from "mongoose";

const { Schema, model } = mongoose;


const sessionSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        check_in: {
            type: String,
            required: true,
        },
        check_out: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);


const Session = model("Session", sessionSchema);
export default Session;