const express = require("express");

const app = express();
app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

const nameData = require("./routes/name");
const listRoute = require("./routes/list");

app.use(nameData.routes);
app.use(listRoute);

// Shortcut for http.createServer
app.listen(3000);
