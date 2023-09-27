const express = require("express");
const { Validators } = require("./helpers/dataValidators");
const app = express();
const PORT = 3000;
const route = "tasks";
const LEVELS = ["low", "high", "medium"];
const tasks = [
  {
    id: 1,
    title: "Write API for Deleting whatsapp messages",
    description: "Delete whatsapp messages",
    status: "pending",
    priorityLevel: "high",
    creationDate: "2023-02-12",
  },
  {
    id: 2,
    title: "Write API for Deleting whatsapp messages",
    description: "Delete whatsapp messages",
    status: "completed",
    priorityLevel: "low",
    creationDate: "2023-03-28",
  },
];
app.use(express.json()); // for parsing application/json

// For Add Tasks added priority Level and creation date
app.post(`/${route}`, (req, res) => {
  const task = req.body;
  const isValid = Validators(task);
  if (isValid.status) {
    tasks.push(task);
    return res.status(200).send(tasks);
  }
  return res.status(400).send("Enter data");
});

// For retriving all tasks added sorting and filtering
app.get(`/${route}`, (req, res) => {
  let filterTasks = [...tasks];
  // filter tasks based on completion status
  if (req.query.status) {
    filterTasks = filterTasks.filter((item) =>
      item.status.toLowerCase().includes(req.query.status.toLowerCase())
    );
  } else if (req.query.sort == "creationDate") {
    //  Sorting on creationDate asc and desc
    if (req.query.order == "asc") {
      filterTasks.sort(
        (a, b) => new Date(a.creationDate) - new Date(b.creationDate)
      );
    } else if (req.query.order == "desc") {
      filterTasks.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
      );
    }
  }

  res.status(200).send(filterTasks);
});

// For retriving single task by id
app.get(`/${route}/:id`, (req, res) => {
  const id = req.params.id;
  const task = tasks.find((obj) => obj.id == id);
  if (task) {
    return res.status(200).send(task);
  } else {
    return res.status(404).send("task not found");
  }
});

// For updating single task by id
app.put(`/${route}/:id`, (req, res) => {
  const taskId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedStatus = req.body.status;
  const updatedDesc = req.body.description;
  const updatedPriority = req.body.priorityLevel;
  tasks.forEach((obj) => {
    if (obj.id == taskId) {
      obj.title = updatedTitle;
      obj.status = updatedStatus;
      obj.description = updatedDesc;
      obj.priorityLevel = updatedPriority;
    }
  });
  //   const task = tasks.find((obj) => obj.id == taskId);
  res.status(200).send(tasks);
});

// For deleting single task by id
app.delete(`/${route}/:id`, (req, res) => {
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

// Fetch tasks based on priority levels only for low, medium and high
app.get(`/${route}/priority/:level`, (req, res) => {
  const level = req.params.level;
  const checkLevel = LEVELS.includes(level);
  if (checkLevel) {
    const filteredTasks = tasks.filter((item) => item.priorityLevel === level);
    return res.status(200).json({ message: "success", data: filteredTasks });
  }else {
    return res.status(403).json('Invalid Priority Level')
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("error -", error);
  } else {
    console.log(`Server running on port - ${PORT}`);
  }
});
