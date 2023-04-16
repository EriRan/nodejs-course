import { serve } from "https://deno.land/std@0.183.0/http/server.ts";
// Async iterable - array full of promises
serve((_req) => new Response("Hello, world"), { port: 3000 });
