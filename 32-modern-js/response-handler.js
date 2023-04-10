// Import fs that supports promises?
import fs from "fs/promises";

const resHandler = (req, res, next) => {
  fs.readFile("my-page.html", "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

export default resHandler;
