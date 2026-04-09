// Imports
import express from "express";
import mongoose from "mongoose";
import amqp from "amqplib";

// Express server instance creation
const app = express();
const PORT = 3002;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/tasks")
  .then("MongoDB connected succesfully! 🚀")
  .catch((err) => console.error("Some error occured: ", err));

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Creating the model for the tasks
const Task = mongoose.model("Task", TaskSchema);

// Global variables to store the rabbitMQ connection and the rabbitMQ channel
let channel, connection;

// Rabbit MQ connection
async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
  while (retries) {
    try {
      connection = await amqp.connect("amqp://localhost:5672");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created");
      console.log("Connected to rabbitMQ");
      return;
    } catch(error) {
      console.error("RabbitMQ connection error: ", error.message);
      retries--;
      console.log("Retrying connection again: ", retries);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Routes
// Task Routes
app.post("/tasks", async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const message = {taskId: task._id, userId, title};
    if(!channel){
      return res.status(503).json({
        error: "RabbitMQ not connected"
      });
    }

    channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
    res.status(201).json({
      message: "Task is succesfully created!",
      task,
    });
  } catch (error) {
    console.error("Error occured ", error);
    res.status(500).json({ error: "Internal Server error!" });
  }
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.delete("/tasks/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const result = await Task.deleteMany({ userId });

  res.json({
    message: "Tasks deleted",
    deletedCount: result.deletedCount,
  });
});

app.listen(PORT, () => {
  console.log("Task service server is running on port 3001 ✅");
  connectRabbitMQWithRetry();
});

