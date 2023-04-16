const fs = require("fs").promises;

const text = "This is a file write test";

fs.writeFile("node-message.txt", text).then(() => {
  console.log("Wrote file!");
});
