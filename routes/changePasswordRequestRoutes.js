import express from "express";
import {
    createChangePasswordRequest,
    getAllChangePasswordRequests,
    getUserChangePasswordRequests,
    updateChangePasswordStatus,
    deleteChangePasswordRequest,
} from "../controllers/changePasswordRequestControllers.js";

const router = express.Router();

router.post("/", createChangePasswordRequest); // Create a new change password request
router.get("/", getAllChangePasswordRequests); // Get all requests (Admin or HR)
router.get("/user/:user_id", getUserChangePasswordRequests); // Get requests for a specific user
router.put("/:id/status", updateChangePasswordStatus); // Approve or reject a request
router.delete("/:id", deleteChangePasswordRequest); // Delete a request

export default router;