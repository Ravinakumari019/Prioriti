const Task =require('../models/Task');

// @desc Get all tasks (Admin: all, User: assigned)
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
    try {
        const {status} = req.query;
        let filter = {};
        if(status){
            filter.status = status;
        }
        let tasks;
        if (req.user.role === 'admin') {
            // Admin can see all tasks
            tasks = await Task.find(filter).populate('assignedTo', 'name email profilePicture');
        }
        else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id }).populate('assignedTo', 'name email profilePicture');
        }

        // add completed todo checklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(item => item.completed).length;
                return {
                    ...task.toObject(),
                    completedCount: completedCount};
            })
        );
        // status summary counts
        const allTasks = await Task.countDocuments(
        req.user.role==="admin" ? {}:{assignedTo: req.user._id});
        
        const pending = await Task.countDocuments({
            ...filter,
            status: 'pending',
            ...(req.user.role !== 'admin' &&  { assignedTo: req.user._id })

        });
        const inProgress = await Task.countDocuments({
            ...filter,
            status: 'in-progress',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });
        
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'completed',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        res.json({
            tasks,
            statusSummary: {
                allTasks,
                pending,
                inProgress,
             completedTasks,
            },
        });

            } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
        try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profilePicture');
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);

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
            const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if(!Array.isArray(req.body.assignedTo)) {
          return res
          .status(400)
          .json({ message: 'AssignedTo must be an array of user ids' });
      }
      task.assignedTo = req.body.assignedTo;
    }
     const updatedTask = await task.save();
    res.json({ message: 'Task updated successfully', task: updatedTask});
    } catch (error) {
          console.error("Update Task Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Delete a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private/Admin
const deleteTask = async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to delete this task' }); 
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update task status
// @route PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
        try { 
            const task = await Task.findById(req.params.id);
            if(!task) return res.status(404).json({ message: 'Task not found' });
              
            const isAssigned = task.assignedTo.some(
                (userId) => userId.toString() === req.user._id.toString()
            );

            if (!isAssigned && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'You are not authorized to update this task' });
            }
            task.status = req.body.status || task.status;

            if(task.status === 'Completed') {
                task.todoChecklist.forEach(item => (
                    item.completed = true));
                    task.progress = 100;
            }
            await task.save();
            res.json({ message: 'Task status updated successfully', task });

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
const updateTaskChecklist = async (req, res) => {
    try{
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if(!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }
        task.todoChecklist = todoChecklist;

        // Auto-update progress based on checklist completion
        const completedCount = todoChecklist.filter(item => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        //Auto-mark task as completed if all checklist items are done
        if(task.progress === 100) {
            task.status = 'Completed';
        } else if(task.status > 0) {
            task.status = 'In Progress'; // Reset status if checklist is updated
        } else{
            task.status = 'Pending'; // Reset status if checklist is empty
        }
        await task.save();
        const updatedTask = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email profilePicture');
        res.json({ message: 'Task checklist updated successfully', task: updatedTask });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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


