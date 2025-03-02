import EscalationRequest from "../models/escalationRequestModel.js";

export const createEscalationRequest = async (req, res) => {
    try {
        const { task_id, requested_by, reason } = req.body;

        const prevRequest = await EscalationRequest.find({ task_id });

        if (prevRequest) {
            return res.status(401).json({ message: "escalation request already created" })
        }

        const newRequest = await EscalationRequest.create({
            task_id,
            requested_by,
            reason,
            status: "pending",
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllEscalationRequests = async (req, res) => {
    try {
        const requests = await EscalationRequest.find()
            .populate("task_id", "title description")
            .populate("requested_by", "fullname email")
            .populate("approved_by", "fullname email");

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getTaskEscalationRequests = async (req, res) => {
    try {
        const requests = await EscalationRequest.find({ task_id: req.params.task_id });

        if (!requests.length) {
            return res.status(404).json({ message: "No escalation requests found for this task" });
        }

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateEscalationRequestStatus = async (req, res) => {
    try {
        const { status, approved_by } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const request = await EscalationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Escalation request not found" });
        }

        request.status = status;
        request.approved_by = approved_by;
        await request.save();

        res.json({ message: `Escalation request marked as ${status}`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const deleteEscalationRequest = async (req, res) => {
    try {
        const request = await EscalationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Escalation request not found" });
        }

        await request.deleteOne();
        res.json({ message: "Escalation request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
