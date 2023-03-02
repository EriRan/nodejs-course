import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

export const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
