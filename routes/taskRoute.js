const { taskRegister, getTask, updateTask, deleteUser, getSingleTask } = require('../controller/taskController');
const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require('../middleware/authMiddleware');
const { getMyTasks, updateTaskStatus, getMyTaskCounts } = require('../usertaskcontroller/userTaskController');

// Create Task
router.post(
  "/create-task",
  upload.array("attachments", 5),
  taskRegister
);

// Get All Tasks
router.get('/manage-task', getTask);

// Get Single Task
router.get('/single-task/:id', getSingleTask);

// Update Task
router.put(
  "/update-task/:id",
  upload.array("attachments", 5),
  updateTask
);

// Delete Task
router.delete("/delete-task/:id", deleteUser);

// User Task Routes
router.get("/my-tasks", authMiddleware, getMyTasks);
router.put("/update-status/:id", authMiddleware, updateTaskStatus);
router.get("/my-task-counts", authMiddleware, getMyTaskCounts);

module.exports = router;
