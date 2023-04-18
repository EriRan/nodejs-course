import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

let todos: Array<Todo> = [];

router.get("/todos", (ctx) => {
  ctx.response.body = { todos: todos };
});

router.post("/todos", async (ctx) => {
  const data = await ctx.request.body().value;
  const newTodo: Todo = { id: new Date().toISOString(), text: data.text };

  todos.push(newTodo);
  ctx.response.body = { message: "Created todo", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  const data = await ctx.request.body().value;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === todoId);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };
    ctx.response.body = { message: "Updated todo" };
  } else {
    ctx.response.status = 404;
  }
});

router.delete("/todos/:todoId", (ctx) => {
  const todoId = ctx.params.todoId;
  todos = todos.filter((todoItem) => todoItem.id !== todoId);
  ctx.response.body = { message: "Deleted todo" };
});

export default router;
