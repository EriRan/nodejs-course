const express = require("express");

const router = express.Router();

let todos = [];

router.get("/", (req, res, next) => {
  return res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body ;
  const newTodo = { id: new Date().toISOString(), text: body.text };

  todos.push(newTodo);

  return res
    .status(201)
    .json({ message: "Added todo", todo: newTodo, todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params;
  const id = params.todoId;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === id);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
    return res.status(200).json({ message: "Updated todo", todos: todos });
  }
  return res.status(404).json({ message: "Could not find todo for this id" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params;
  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({ message: "Deleted todo", todos: todos });
});

module.exports = router;
