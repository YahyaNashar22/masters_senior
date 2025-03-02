import ChangePasswordRequest from "../models/changePasswordRequestModel.js";

export const createChangePasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        const existingRequest = await ChangePasswordRequest.findOne({ email });
        if (existingRequest) {
            if (existingRequest.status == "pending") {
                return res.status(404).json({ message: "You already have a pending request" });
            }
            if (existingRequest.status == "accepted") {
                return res.status(203).json({ message: "Request approved. You can now change your password." });
            }
            if (existingRequest.status == "rejected") {
                return res.status(404).json({ message: "Request rejected!" });
            }
        }

        const newRequest = await ChangePasswordRequest.create({
            email,
            status: "pending",
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllChangePasswordRequests = async (req, res) => {
    try {
        const requests = await ChangePasswordRequest.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUserChangePasswordRequests = async (req, res) => {
    try {
        const requests = await ChangePasswordRequest.find({ user_id: req.params.user_id });

        if (!requests.length) {
            return res.status(404).json({ message: "No change password requests found" });
        }

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateChangePasswordStatus = async (req, res) => {
    try {
        const { status, approved_by } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const request = await ChangePasswordRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Change password request not found" });
        }

        request.status = status;
        request.approved_by = approved_by;
        await request.save();

        res.json({ message: `Change password request ${status}`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteChangePasswordRequest = async (req, res) => {
    try {
        const request = await ChangePasswordRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Change password request not found" });
        }

        await request.deleteOne();
        res.json({ message: "Change password request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};