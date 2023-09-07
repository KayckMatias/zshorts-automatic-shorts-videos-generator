const path = require("path");
const fs = require("fs");

const { PathResolve } = require("./resolve");

/**
 * Returns a list of all available videos in the videos directory.
 * @returns {array} - An array of video file names.
 */
function listAllAvailableVideos() {
  return fs.readdirSync(PathResolve.videos).filter((file) => {
    return path.extname(file).toLowerCase() === ".mp4";
  });
}

/**
 * Retrieves the default story file.
 * @returns {Promise<Object>} A promise that resolves to the default story file object.
 */
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
