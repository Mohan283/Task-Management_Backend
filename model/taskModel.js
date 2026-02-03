const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    date: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    attachments: [
      {
        originalName: String,
        fileName: String,
        filePath: String,
        fileType: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
