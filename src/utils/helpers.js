const path = require("path");
const fs = require("fs");

const { PathResolve } = require("./resolve");

function listAllAvailableVideos() {
  return fs.readdirSync(PathResolve.videos).filter((file) => {
    return path.extname(file).toLowerCase() === ".mp4";
  });
}

async function getDefaultStoryFile() {
  return new Promise((resolve, reject) => {    
    fs.readFile(PathResolve.manual_story, "utf8", (err, story) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(story));
      }
    });
  });
}

module.exports = {
  listAllAvailableVideos,
  getDefaultStoryFile,
};
