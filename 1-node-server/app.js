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
    fs.writeFileSync("message.txt", "DUMMY");
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first page</title></head>");
  res.write("<body><h1>Hello from Node.js server!</body>");
  res.write("</html>");
  return res.end();
});

// Node.js will not immediately exit when this function is called
// Some optional arguments
// port and hostname
server.listen(3000);
