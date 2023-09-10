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

async function getStoryData(storyId = null) {
  const storyPath =
    process.env.STORY_BY_GPT == "true"
      ? path.join(PathResolve.stories, `${storyId}.json`)
      : path.join(PathResolve.manual_story);

  const storyData = fs.readFileSync(storyPath, "utf8", (err, data) => {
    if (err) {
      Logger.error("Error reading the story file:", err);
      return;
    }

    return data;
  });

  return JSON.parse(storyData);
}

module.exports = {
  listAllAvailableVideos,
  getDefaultStoryFile,
  getStoryData,
};
