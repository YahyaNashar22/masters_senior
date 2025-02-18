import express from "express";
import {
    createLeaveRequest,
    getAllLeaveRequests,
    getUserLeaveRequests,
    updateLeaveStatus,
    deleteLeaveRequest,
} from "../controllers/leaveRequestControllers.js";

const router = express.Router();

router.post("/", createLeaveRequest); // Create a new leave request
router.get("/", getAllLeaveRequests); // Get all leave requests (Admin or HR)
router.get("/user/:user_id", getUserLeaveRequests); // Get all leave requests for a specific user
router.put("/:id/status", updateLeaveStatus); // Approve or reject a leave request
router.delete("/:id", deleteLeaveRequest); // Delete a leave request

export default router;