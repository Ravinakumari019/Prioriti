const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// @desc Export all tasks as an Excel file
// @route GET /api/report/export/tasks
// @access Private/Admin
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map(user => `${user.name} (${user.email})`).join(", ")
        : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "N/A",
        assignedTo,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting tasks report:", error);
    res.status(500).json({ message: "Failed to export tasks report" });
  }
};

// @desc Export user-task as an Excel file
// @route GET /api/report/export/users
// @access Private/Admin
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const tasks = await Task.find().populate("assignedTo", "name email");

    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    tasks.forEach((task) => {
      if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((assignedUser) => {
          const userStat = userTaskMap[assignedUser._id];
          if (userStat) {
            userStat.taskCount++;
            const status = task.status?.toLowerCase();
            if (status === "pending") userStat.pendingTasks++;
            else if (status === "in progress") userStat.inProgressTasks++;
            else if (status === "completed") userStat.completedTasks++;
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In-Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((userTask) => {
      worksheet.addRow(userTask);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting users report:", error);
    res.status(500).json({ message: "Failed to export users report" });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
