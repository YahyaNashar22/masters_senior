import IncorrectAttendanceRequest from "../models/incorrectAttendanceRequestModel.js";


export const createIncorrectAttendanceRequest = async (req, res) => {
    try {
        const { user_id, from, to } = req.body;

        const newRequest = await IncorrectAttendanceRequest.create({
            user_id,
            from,
            to,
            status: "pending",
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllIncorrectAttendanceRequests = async (req, res) => {
    try {
        const requests = await IncorrectAttendanceRequest.find().populate("user_id", "fullname email");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserIncorrectAttendanceRequests = async (req, res) => {
    try {
        const requests = await IncorrectAttendanceRequest.find({ user_id: req.params.user_id });

        if (!requests.length) {
            return res.status(404).json({ message: "No incorrect attendance requests found" });
        }

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const updateIncorrectAttendanceStatus = async (req, res) => {
    try {
        const { status, approved_by } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const request = await IncorrectAttendanceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Incorrect attendance request not found" });
        }

        request.status = status;
        request.approved_by = approved_by;
        await request.save();

        res.json({ message: `Incorrect attendance request ${status}`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteIncorrectAttendanceRequest = async (req, res) => {
    try {
        const request = await IncorrectAttendanceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Incorrect attendance request not found" });
        }

        await request.deleteOne();
        res.json({ message: "Incorrect attendance request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};