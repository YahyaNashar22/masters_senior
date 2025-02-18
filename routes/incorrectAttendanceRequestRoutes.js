import express from "express";
import {
    createIncorrectAttendanceRequest,
    getAllIncorrectAttendanceRequests,
    getUserIncorrectAttendanceRequests,
    updateIncorrectAttendanceStatus,
    deleteIncorrectAttendanceRequest,
} from "../controllers/incorrectAttendanceRequestControllers.js";

const router = express.Router();

router.post("/", createIncorrectAttendanceRequest); // Create a new incorrect attendance request
router.get("/", getAllIncorrectAttendanceRequests); // Get all requests (Admin or HR)
router.get("/user/:user_id", getUserIncorrectAttendanceRequests); // Get requests for a specific user
router.put("/:id/status", updateIncorrectAttendanceStatus); // Approve or reject a request
router.delete("/:id", deleteIncorrectAttendanceRequest); // Delete a request

export default router;
