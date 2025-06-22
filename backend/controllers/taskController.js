const Task =require('../models/Task');

// @desc Get all tasks (Admin: all, User: assigned)
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
    try {
       
     } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Create a new task (Admin only)
// @route POST /api/tasks
// @access Private/Admin
const createTask = async (req, res) => {
        try {
             const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(todoChecklist)) {
            return res.status(400)
            .json({ message: "Todo checklist must be an array" });

        }

        const tasks = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
            createdBy: req.user._id, // Assuming req.user is populated with the authenticated user
        });
        res.status(201).json({message: 'Task created successfully', tasks});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Delete a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private/Admin
const deleteTask = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update task status
// @route PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Dashboard data (Admin only)    
// @route GET /api/tasks/dashboard-data
// @access Private/Admin
const getDashboardData = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc User dashboard data (User -specific)
// @route GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
        try {
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {};

module.exports = {
   getTasks ,
    getTaskById,
    createTask,
    updateTask,     
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
// @desc Update task checklist


