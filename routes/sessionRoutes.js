import express from "express";
import {
    createSession,
    getSessionsByUser,
    getAllSessions,
    updateSession,
    deleteSession,
} from "../controllers/sessionControllers.js";

const router = express.Router();

router.post("/", createSession); // Create a session
router.get("/:user_id", getSessionsByUser); // Get all sessions for a user
router.get("/", getAllSessions); // Get all sessions (Admin only)
router.put("/:id", updateSession); // Update a session (check-out)
router.delete("/:id", deleteSession); // Delete a session

export default router;