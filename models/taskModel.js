import mongoose from "mongoose";

const { Schema, model } = mongoose;


const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        due_date: {
            type: String,
            required: false,
        },
        priority: {
            type: String,
            enum: ["normal", "high", "low"],
            default: "normal",
            required: true,
        },
        status: {
            type: String,
            enum: ["ongoing", "completed", "canceled", "not_started"],
            default: "not_started",
            required: true,
        },
        assignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        completed_at: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
);


const Task = model("Task", taskSchema);
export default Task;
