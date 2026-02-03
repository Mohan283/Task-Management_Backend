const Task = require('../model/taskModel')
const DB=require('../model/database')
// GET /task/my-tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTaskCounts = async (req, res) => {
  const userId = req.user.id;

  const pending = await Task.countDocuments({
    assignedTo: userId,
    status: "Pending"
  });

  const inProgress = await Task.countDocuments({
    assignedTo: userId,
    status: "In Progress"
  });

  const completed = await Task.countDocuments({
    assignedTo: userId,
    status: "Completed"
  });

  res.json({
    pending,
    inProgress,
    completed
  });
};

exports.dbRegister = async (req, res) => {
  try {
    const newDB = new DB(req.body);
    await newDB.save();

    res.status(201).json({
      message: "Data saved successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving data",
      error: error.message
    });
  }
};


exports.getDbData=async(req, res)=>
{
  try {
      const newdb= await DB.find();
      res.status(200).json(newdb)
  } catch (error) {
     res.status(500).json({message:"server error", error: error.message})
  }
}

exports.getOneDbData=async(req, res)=>
{

  try {
    const id= req.params.id;
     
  const dbId = await DB.findById(id)
  
   if(!dbId)
        {
            res.status(404).json({message:"User doesnot exists"})
        }
        // res.status(200).json(newUser)
         res.status(200).json(dbId)
        
  } catch (error) {
     res.status(500).json({errorMessage: error.Message})
  }

}

exports.dbUpdate= async(req, res)=>
{
  try {
    const id= req.params.id;     
    const dbId = await DB.findById(id)
  if(!dbId)
        {
            res.status(404).json({message:"Data doesnot exists"})
        }
     
        const updateData = await DB.findByIdAndUpdate(id, req.body,{new:true})
          res.status(200).json(updateData)


  } catch (error) {
     res.status(500).json({errorMessage: error.Message})
  }
}

exports.dbDelById = async (req,res)=>
{
    try {
        const id = req.params.id;
        const delData = await DB.findByIdAndDelete(id)
        if(!delData)
        {
            res.status(404).json({message:'Data not found'})
        }
        // res.status(200).json(delData);
        res.status(200).json({message:"Deleted Successfully"});
    } catch (error) {
        res.status(500).json({errorMessage: error.Message})
    }
}