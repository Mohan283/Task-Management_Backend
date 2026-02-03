const {taskRegister,getTask,updateTask,deleteUser,getSingleTask} = require('../controller/taskController')
const express = require('express');
const router = express.Router()
const upload = require("../middleware/upload");
const authMiddleware = require('../middleware/authMiddleware')
const {getMyTasks,updateTaskStatus,getMyTaskCounts} = require('../usertaskcontroller/userTaskController')


//task router
router.post(
  "/create-task",
  upload.array("attachments", 5),
  taskRegister
);
router.get('/manage-task', getTask)
router.get('/single-task/:id', getSingleTask)
router.put(
  "/update-task/:id",
  upload.array("attachments", 5), // max 5 files
  updateTask
);
router.delete("/delete-task/:id", deleteUser);

router.get("/my-tasks", authMiddleware, getMyTasks);
router.put(
  "/update-status/:id",
  authMiddleware,
  updateTaskStatus
);

router.get("/my-task-counts", authMiddleware, getMyTaskCounts);
module.exports = router