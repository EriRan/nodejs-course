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

// Crucial method to creating a server
// requestListener as an argument
// Anonymous function provided, modern Javascript style with arrow function
// Node.js uses event driven functionality heavily
const server = http.createServer((req, res) => {
  // These three are important in requests
  console.log(req.url, req.method, req.headers);
  // This quits the event loop and shuts the server down
  // This isn't typically called
  // process.exit();

  // Response
  // Express.js does this way easier
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first page</title></head>");
  res.write("<body><h1>Hello from Node.js server!</body>");
  res.write("</html>");
  res.end();
});

// Node.js will not immediately exit when this function is called
// Some optional arguments
// port and hostname
server.listen(3000);
