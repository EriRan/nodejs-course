import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // Pseudo global variable

const resHandler = (req, res, next) => {
  res.sendFile(path.join(__dirname, "my-page.html"));
};

export default resHandler;
