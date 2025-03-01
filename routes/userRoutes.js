import express from "express";
import {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    changeSupervisor,
    changePasswordRequested,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.post("/:id/change-password", changePassword);
router.post("/change-password-requested", changePasswordRequested);
router.post("/:id/change-supervisor", changeSupervisor);
router.delete("/:id", deleteUser);

export default router;