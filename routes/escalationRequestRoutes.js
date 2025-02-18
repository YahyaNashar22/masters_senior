import express from "express";
import {
    createEscalationRequest,
    getAllEscalationRequests,
    getTaskEscalationRequests,
    updateEscalationRequestStatus,
    deleteEscalationRequest,
} from "../controllers/escalationRequestControllers.js";

const router = express.Router();

router.post("/", createEscalationRequest); // Create a new escalation request
router.get("/", getAllEscalationRequests); // Get all escalation requests
router.get("/task/:task_id", getTaskEscalationRequests); // Get requests for a specific task
router.put("/:id", updateEscalationRequestStatus); // Approve or reject a request
router.delete("/:id", deleteEscalationRequest); // Delete a request

export default router;
