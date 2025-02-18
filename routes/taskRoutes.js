import express from "express";
import {
    createTask,
    getAllTasks,
    getUserTasks,
    updateTaskStatus,
    updateTask,
    deleteTask,
} from "../controllers/taskControllers.js";

const router = express.Router();

router.post("/", createTask); // Create a new task
router.get("/", getAllTasks); // Get all tasks
router.get("/user/:user_id", getUserTasks); // Get tasks assigned to a specific user
router.put("/:id/status", updateTaskStatus); // Update task status
router.put("/:id", updateTask); // Edit task details
router.delete("/:id", deleteTask); // Delete a task

export default router;
