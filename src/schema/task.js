import { modelFactory } from "mongolens"
import moment from "moment"

const TaskModel = modelFactory("Task", {
  name: { type: String },
  description: { type: String },
  duration: { type: Number },
  order: { type: Number },
  lastStartAt: { type: Date },
  finishedAt: { type: Date },
  elapsedTime: { type: Number, default: 0 },
  status: { type: String, default: "unstarted" }
}, { timestamps: true });

TaskModel.addMutation({
  type: "Task",
  name: "startById",
  args: {
    _id: {
      type: "MongoID!"
    }
  },
  resolve: async ({args}) => {
    try {
      const task = await TaskModel.model.findByIdAndUpdate(
        args._id,
        { lastStartAt: moment().format(), status: "ongoing" }, 
        { new: true }
      ).exec()

      if(!task)
        throw new Error("Task not found")
      
      return task
    }
    catch(e) {
      throw new Error(e)
    }
  }
})

TaskModel.addMutation({
  type: "Task",
  name: "pauseById",
  args: {
    _id: {
      type: "MongoID!"
    }
  },
  resolve: async ({args}) => {
    try {
      let task = await TaskModel.model.findById(args._id).exec()
      
      if(!task)
        throw new Error("Task not found")

      if(task.status === "paused") {
        return task;
      }

      const lastStartAt = moment(task.lastStartAt)
      const currentTime = moment()

      const elapsedTime = currentTime.diff(lastStartAt)

      task = await TaskModel.model.findByIdAndUpdate(
        task._id,
        {
          elapsedTime: task.elapsedTime + elapsedTime,
          status: "paused"
        },
        { new: true }
      ).exec()
      
      return task
    }
    catch(e) {
      throw new Error(e)
    }
  }
})

TaskModel.addMutation({
  type: "Task",
  name: "stopById",
  args: {
    _id: {
      type: "MongoID!"
    }
  },
  resolve: async ({args}) => {
    try {
      const task = await TaskModel.model.findByIdAndUpdate(
        args._id,
        { elapsedTime: 0, status: "stopped" }, 
        { new: true }
      ).exec()

      if(!task)
        throw new Error("Task not found")
      
      return task
    }
    catch(e) {
      throw new Error(e)
    }
  }
})

TaskModel.addMutation({
  type: "Task",
  name: "completeById",
  args: {
    _id: {
      type: "MongoID!"
    }
  },
  resolve: async ({args}) => {
    try {
      let task = await TaskModel.model.findById(args._id).exec()
      
      if(!task)
        throw new Error("Task not found")

      if(task.status === "completed") {
        return task
      }

      const currentTime = moment()

      if(task.status === "ongoing") {
        const lastStartAt = moment(task.lastStartAt)
        const elapsedTime = currentTime.diff(lastStartAt)

        task.elapsedTime = task.elapsedTime + elapsedTime
      }

      task = await TaskModel.model.findByIdAndUpdate(
        task._id,
        {
          elapsedTime: task.elapsedTime,
          status: "completed",
          completedAt: currentTime.format()
        },
        { new: true }
      ).exec()
      
      return task
    }
    catch(e) {
      throw new Error(e)
    }
  }
})

export default TaskModel
