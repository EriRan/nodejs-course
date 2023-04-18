import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

let db: Database;

export async function connect(mongodbUser: string, mongoDbPassword: string, mongodAddress: string) {
  const client = new MongoClient();

  await client.connect(
    `mongodb+srv://${mongodbUser}:${mongoDbPassword}@${mongodAddress}/todo-app?authMechanism=SCRAM-SHA-1`,
  );

  db = client.database("todo-app");
}

export function getDb() {
  return db;
}
