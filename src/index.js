const express = require("express");
const { Validators } = require("./helpers/dataValidators");
const app = express();
const PORT = 3000;
const tasks = [
  {
    id: 1,
    title: "Write API for Deleting whatsapp messages",
    description: "Delete whatsapp messages",
    status: "pending",
  },
  {
    id: 2,
    title: "Write API for Deleting whatsapp messages",
    description: "Delete whatsapp messages",
    status: "pending",
  },
];
app.use(express.json()); // for parsing application/json

// For Add Tasks
app.post("/tasks", (req, res) => {
  const task = req.body;
  const isValid = Validators(task);
  if (isValid.status) {
    tasks.push(task);
    return res.status(200).send(tasks);
  }
  return res.status(400).send("Enter data");
});

// For retriving all tasks
app.get("/tasks", (req, res) => {
  res.status(200).send(tasks);
});

// For retriving single task by id
app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const task = tasks.find((obj) => obj.id == id);
  if (task) {
    return res.status(200).send(task);
  } else {
    return res.status(404).send("task not found");
  }
});

// For updating single task by id
app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedStatus = req.body.status;
  const updatedDesc = req.body.description;
  tasks.forEach((obj) => {
    if (obj.id == taskId) {
      obj.title = updatedTitle;
      obj.status = updatedStatus;
      obj.description = updatedDesc;
    }
  });
  //   const task = tasks.find((obj) => obj.id == taskId);
  res.status(200).send(tasks);
});

// For deleting single task by id
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const index = tasks.findIndex((obj) => obj.id == taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    return res
      .status(200)
      .send({ message: "Deleted Successfully", data: tasks });
  } else {
    return res.status(501).send("Task Not Found");
  }

});

app.listen(PORT, (error) => {
  if (error) {
    console.log("error -", error);
  } else {
    console.log(`Server running on port - ${PORT}`);
  }
});
