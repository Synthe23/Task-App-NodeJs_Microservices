// Imports
import express from "express";
import mongoose from "mongoose";

// Express server instance creation
const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB connection setup using Docker-desktop
// mongoose
//   .connect("mongodb://localhost:27017/users")
//   .then(() => console.log("Connected to MongoDB succesfully 🚀"))
//   .catch((err) => console.error("mongoDB connection error: ", err));

// MongoDB connection setup using Docker-desktop
mongoose
  .connect("mongodb://localhost:27017/users")
  .then(() => console.log("Connected to MongoDB succesfully 🚀"))
  .catch((err) => console.error("mongoDB connection error: ", err));

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required!"],
  },
//   password: {
//     type: String,
//     required: [true, "Password is required!"],
//   },
});

// Creating the model for the user
const User = mongoose.model("User", userSchema);

// Routes
// User Routes
app.get("/", (req, res) => {
  res.json({ msg: "Hello you are in the home page of the app!" });
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({
      message: "User created succesfully!",
      user,
    });
  } catch (error) {
    console.error("Some error occured: ", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

app.get('/users', async(req, res) => {
    const users = await User.find();
    res.json(users);
});

app.delete("/users/:name", async(req, res) => {
  const {name} = req.params;

  const deleteUser = await User.deleteMany({name});
  res.status(201).json({
    message: "User deleted"
  })
})


// Starting the server
app.listen(PORT, () => {
  console.log("User service server is running on the port 3k ✅");
});

