const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Assignment</title></head>");
    res.write("<body>");
    res.write("<h1>Greetings!</h1>");
    res.write(
      "<form action='/create-user' method='POST'><input type='text' name='username'><button type='submit'>Send</button></input></form>"
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  } else if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Assignment</title></head>");
    res.write("<body>");
    res.write("<ul><li>User 1</li><li>User 2</li><li>User 3</li></ul>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  } else if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      // Log username
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody.split("=")[1]);
      // Redirect back to /
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Default page</title></head>");
  res.write("<body><h1>Default page</body>");
  res.write("</html>");
  return res.end();
};

exports.handler = requestHandler;
