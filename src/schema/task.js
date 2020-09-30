import { modelFactory } from "mongolens"

export const TaskModel = modelFactory("Task", {
  name: { type: String },
  description: { type: String },
  duration: { type: Number },
  order: { type: Number },
  pausedAt: { type: Date },
  finishedAt: { type: Date },
  elapsedTime: { type: Number }
}, { timestamps: true });
