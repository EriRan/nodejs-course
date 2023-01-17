const fs = require("fs");

const requestHandler = (req, res) => {
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
};

// Shortcut of module.exports
exports.handler = requestHandler;
exports.someText = "Some hardcoded text";
