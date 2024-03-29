import { Application } from "https://deno.land/x/oak/mod.ts";
import todoRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

const configData = config();

connect(configData["mongodb_user"], configData["mongodb_password"], configData["mongodb_cluster_address"]);

const app = new Application();

app.use(async (ctx, next) => {
  console.log("Middleware");
  // Need await when using Oak. Need to wait for promise of other routers
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, FETCH"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  await next();
});

app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());

await app.listen({ port: 8000 });
