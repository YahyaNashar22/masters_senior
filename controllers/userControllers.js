import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_TOKEN, { expiresIn: "7d" });

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

        // Include role filter if provided
        const roleFilter = role ? { role } : {};

        // Find users based on search and role filters
        const users = await User.find({ ...searchQuery, ...roleFilter });
        res.json(users);
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