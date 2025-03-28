import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ChangePasswordRequest from "../models/changePasswordRequestModel.js";
import Session from "../models/sessionModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import IncorrectAttendanceRequest from "../models/incorrectAttendanceRequestModel.js";
import EscalationRequest from "../models/escalationRequestModel.js";

export const registerUser = async (req, res) => {
    try {
        const { fullname, username, email, password, role, supervisor_id } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user
        const user = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword,
            role,
            supervisor_id,
        });

        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.status === 'blocked') {
            return res.status(400).json({ message: "Access Denied! Account Blocked" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_TOKEN, { expiresIn: "7d" });

        // Create a new session (check-in)
        const session = await Session.create({
            user_id: user._id,
            check_in: new Date(),
            check_out: null, // Will be updated on logout
        });

        res.json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const getUsers = async (req, res) => {
    try {
        const { query, role } = req.body;
        // Construct the search query with regex for case-insensitive search
        const searchQuery = query
            ? {
                $or: [
                    { fullname: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } },
                    { username: { $regex: query, $options: "i" } },
                ],
            }
            : {};

        // Include role filter if roles array is provided and non-empty
        const roleFilter = role && Array.isArray(role) && role.length > 0
            ? { role: { $in: role } }
            : {};

        // Find users based on search and role filters
        const users = await User.find({ ...searchQuery, ...roleFilter });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        // Find the most recent session for the user that hasn't been checked out
        const session = await Session.findOne({
            user_id,
            check_out: null, // Ensure it's an active session
        }).sort({ check_in: -1 });

        if (session) {
            session.check_out = new Date();
            await session.save();
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { fullname, username, email, role, status } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.status = status || user.status;

        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const changePasswordRequested = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user by ID
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // make sure change password has been requested
        const passwordRequest = await ChangePasswordRequest.find({ email: user.email });
        if (!passwordRequest) return res.status(404).json({ message: "Permission not requested" });


        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Delete the password change request
        await ChangePasswordRequest.deleteOne({ email: user.email });

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const changeSupervisor = async (req, res) => {
    try {
        const { supervisor_id } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if supervisor exists
        const supervisor = await User.findById(supervisor_id);
        if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

        // Update supervisor
        user.supervisor_id = supervisor_id;
        await user.save();

        res.json({ message: "Supervisor changed successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const sessions = await Session.find({ user_id: userId });
        const leaveRequests = await LeaveRequest.find({ user_id: userId });
        const incorrectAttendanceRequests = await IncorrectAttendanceRequest.find({ user_id: userId });
        const escalationRequests = await EscalationRequest.find({ requested_by: userId });
        const changePasswordRequests = await ChangePasswordRequest.find({ email: user.email });

        return res.status(200).json({
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            sessions,
            leaveRequests,
            incorrectAttendanceRequests,
            escalationRequests,
            changePasswordRequests,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}