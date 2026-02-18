const taskRegisterService = async (body, attachments) => {
  try {
    const assignedUsers = body.assignedTo
      ? Array.isArray(body.assignedTo)
        ? body.assignedTo
        : [body.assignedTo]
      : [];

    const formattedAttachments = attachments
      ? attachments.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          filePath: file.path,
          fileType: file.mimetype,
        }))
      : [];

    const newTask = new Task({
      title: body.title,
      description: body.description,
      priority: body.priority,
      date: body.date,
      dueDate: body.dueDate,
      assignedTo: assignedUsers,
      attachments: formattedAttachments,
    });

    return await newTask.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports={taskRegisterService}