const Task = require('../model/taskModel')
const {taskRegisterService } = require('../service/taskService')

const taskRegister = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const savedTask = await taskRegisterService(
      req.body,
      req.files
    );

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



const getTask = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email");

    // Count by status
    const pendingCount = await Task.countDocuments({ status: "Pending" });
    const inProgressCount = await Task.countDocuments({ status: "In Progress" });
    const completedCount = await Task.countDocuments({ status: "Completed" });

    res.status(200).json({
      tasks,
      counts: {
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};


const getSingleTask=async(req, res)=>
{
  try {
    const id = req.params.id;
        const newTask = await Task.findById(id);
        if(!newTask)
        {
            res.status(404).json({message:"User doesnot exists"})
        }
        // res.status(200).json(newUser)
        res.status(200).json(newTask);

    
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}


const updateTask = async (req, res) => {
  try {
    const { title, description, priority, date, dueDate, assignedTo } = req.body;

    const formattedAttachments = req.files
      ? req.files.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          filePath: file.path,
          fileType: file.mimetype,
        }))
      : [];

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        date,
        dueDate: new Date(dueDate),
        assignedTo: assignedTo ? [assignedTo] : [],
        ...(formattedAttachments.length > 0 && { attachments: formattedAttachments }),
      },
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};



module.exports= {taskRegister, getTask, updateTask,deleteUser,getSingleTask}