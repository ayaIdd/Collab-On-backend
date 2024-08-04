import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    status: {
      type: String,
      enum: ["not started", "in progress", "completed", "on hold"],
      default: "not started",
    },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    objectives: [
      {
        description: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    workplace: { type: Schema.Types.ObjectId, ref: 'Workplace', required: true },

  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
