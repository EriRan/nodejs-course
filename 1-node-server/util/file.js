const fs = require("fs");

// "fire and forget". Caller will not wait for this function to finish
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;