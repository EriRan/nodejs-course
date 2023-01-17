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
const routes = require("./routes");

// Crucial method to creating a server
// requestListener as an argument
// Anonymous function provided, modern Javascript style with arrow function
// Node.js uses event driven functionality heavily
const server = http.createServer();

// Node.js will not immediately exit when this function is called
// Some optional arguments
// port and hostname
server.listen(3000);
