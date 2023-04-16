import { Application } from "https://deno.land/x/oak/mod.ts";
import todoRoutes from "./routes/todos.ts";

const app = new Application();

app.use( async (ctx, next) => {
  console.log("Middleware");
  // Need await when using Oak. Need to wait for promise of other routers
  await next();
});

app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());

await app.listen({ port: 3000 });
