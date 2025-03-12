import Session from "../models/sessionModel.js";
import transporter from "../utils/nodemailerTransporter.js";

export const createSession = async (req, res) => {
    try {
        const { user_id, check_in, check_out } = req.body;

        // Create new session
        const session = await Session.create({
            user_id,
            check_in,
            check_out,
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getSessionsByUser = async (req, res) => {
    try {
        const sessions = await Session.find({ user_id: req.params.user_id });
        if (!sessions) return res.status(404).json({ message: "No sessions found" });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const updateSession = async (req, res) => {
    try {
        const { check_out } = req.body;

        const session = await Session.findById(req.params.id).populate("user_id");
        if (!session) return res.status(404).json({ message: "Session not found" });

        // Update session check-out time
        session.check_out = check_out;
        await session.save();

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
        Session updated successfully 
    </p>
</body>
</html>`,
            }
        ).then(() => console.log("sent"))
            .catch(() => console.log("unable to send"));

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        await session.deleteOne();
        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};