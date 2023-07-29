const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const Todo = require("./models/todo");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  return res.status(200).json({
    todos,
  });
});

app.post("/todos", async (req, res) => {
  const name = req.body.name;
  const todo = new Todo({
    name,
  });
  await todo.save();
  res.status(201).json({ message: "Goal saved", todo });
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.status(200).json({ message: "Todo updated", todo });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndRemove(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

mongoose.connect(
  "mongodb://mongodb:27017/todos-app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Unable to connect to MongoDB");
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
      app.listen(8000, () => {
        console.log("Now listening on PORT 8000");
      });
    }
  }
);
