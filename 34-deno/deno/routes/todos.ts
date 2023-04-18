import { Router } from "https://deno.land/x/oak/mod.ts";
import { getDb } from "../helpers/db_client.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("todos").find();
  const transformedTodos = await todos.map((todo) => {
    return { id: todo._id, text: todo.text };
  });
  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  const data = await ctx.request.body().value;
  const newTodo: Todo = { text: data.text };

  const id = await getDb().collection("todos").insertOne(newTodo);

  newTodo.id = id.$oid;
  ctx.response.body = { message: "Created todo", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  const data = await ctx.request.body().value;
  await getDb().collection("todos").updateOne({_id: new ObjectId(todoId)}, { $set: { text: data.text }})

  ctx.response.body = { message: "Updated todo" };
});

router.delete("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  
  await getDb().collection("todos").deleteOne({_id: new ObjectId(todoId)});

  ctx.response.body = { message: "Deleted todo" };
});

export default router;
