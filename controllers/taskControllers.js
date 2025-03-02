import Task from "../models/taskModel.js";


export const createTask = async (req, res) => {
    try {
        const { title, description, due_date, priority, assignee, created_by } = req.body;

        const newTask = await Task.create({
            title,
            description,
            due_date,
            priority,
            assignee,
            created_by,
            status: "not_started",
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignee", "fullname email");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignee: req.params.user_id });

        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found" });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const updateTaskStatus = async (req, res) => {
    try {
        const { status, completed_at } = req.body;

        if (!["ongoing", "completed", "canceled", "not_started"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = status;
        if (status === "completed") {
            task.completed_at = completed_at || new Date().toISOString();
        }
        await task.save();

        res.json({ message: `Task marked as ${status}`, task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const updateTask = async (req, res) => {
    try {
        const { assignee } = req.body
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            $set: {
                assignee
            }
        }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

