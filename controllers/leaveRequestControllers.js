import LeaveRequest from "../models/leaveRequestModel.js";
import transporter from "../utils/nodemailerTransporter.js";

export const createLeaveRequest = async (req, res) => {
    try {
        const { user_id, reason, from, to, full_day } = req.body;

        const leaveRequest = await LeaveRequest.create({
            user_id,
            reason,
            from,
            to,
            full_day,
        });

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getAllLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find().populate("user_id", "fullname email");
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUserLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ user_id: req.params.user_id });
        if (!leaveRequests.length) {
            return res.status(404).json({ message: "No leave requests found" });
        }

        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateLeaveStatus = async (req, res) => {
    try {
        const { status, approved_by } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const leaveRequest = await LeaveRequest.findById(req.params.id).populate("user_id");
        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        leaveRequest.status = status;
        leaveRequest.approved_by = approved_by;
        await leaveRequest.save();

        await transporter.sendMail(
            {
                from: process.env.SENDER_EMAIL,
                to: request.user_id.email,
                subject: "Change Password Request",
                html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>
        </head>
        <body>
            <p>
                Request ${status} 
            </p>
        </body>
        </html>`,
            }
        ).then(() => console.log("sent"))
            .catch(() => console.log("unable to send"));

        res.json({ message: `Leave request ${status}`, leaveRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        await leaveRequest.deleteOne();
        res.json({ message: "Leave request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};