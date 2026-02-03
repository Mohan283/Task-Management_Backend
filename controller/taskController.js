const Task = require('../model/taskModel')


const taskRegister = async (req, res) => {
  try {
    const attachments = req.files
      ? req.files.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          filePath: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        }))
      : [];

    const assignedUsers = req.body.assignedTo
      ? [req.body.assignedTo]
      : [];

    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      date: req.body.date,
      dueDate: req.body.dueDate,
      assignedTo: assignedUsers,
      attachments, // ✅ proper structure
    });

    const savedData = await newTask.save();

    return res.status(201).json({
      message: "Task Created Successfully",
      data: savedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error saving task",
      error: error.message,
    });
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
    const { title, description, priority, date, dueDate,assignedTo  } = req.body;

    let attachments = [];
    if (req.files) {
      attachments = req.files.map((file) => file.filename);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        date,
        dueDate,
        assignedTo: assignedTo ? [assignedTo] : [],
        ...(attachments.length > 0 && { attachments }),
      },
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
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