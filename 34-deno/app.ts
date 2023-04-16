const text = "This is a file write test";
const encoder = new TextEncoder();
const data = encoder.encode(text);
// Returns a promise
Deno.writeFile("message.txt", data).then(() => {
  console.log("Wrote to a file!");
});
