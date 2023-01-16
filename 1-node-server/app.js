/**
 * Most Node functionalities are not available by default
 * Node ships with a few core modules
 * http, https, fs, path, os
 * http: launch a server, send requests
 * https: Launch ssl encoded server
 */

// Node.js uses require to import most often?
// I like import more
const http = require("http");
const fs = require("fs");

// Crucial method to creating a server
// requestListener as an argument
// Anonymous function provided, modern Javascript style with arrow function
// Node.js uses event driven functionality heavily
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></input></form></body>"
    );
    res.write("</html>");
    return res.end();
  } else if (url === "/message" && method === "POST") {
    // Event listener
    // Listening for data event
    // Fires when a new chunk is ready to be read
    // These are used often in Node
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        // Send response only after we are done with file
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  // We always want some kind of response. Otherwise Node.js will have to wait for a return from one of the .on() functions
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Default page</title></head>");
  res.write("<body><h1>Default page</body>");
  res.write("</html>");
  return res.end();
});

// Node.js will not immediately exit when this function is called
// Some optional arguments
// port and hostname
server.listen(3000);
