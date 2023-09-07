const path = require("path");
const fs = require("fs");

const { PathResolve } = require("./resolve");

function listAllAvailableVideos() {
  return fs.readdirSync(PathResolve.videos).filter((file) => {
    return path.extname(file).toLowerCase() === ".mp4";
  });
}

module.exports = {
  listAllAvailableVideos
};
