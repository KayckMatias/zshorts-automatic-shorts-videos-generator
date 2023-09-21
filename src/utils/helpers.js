const path = require("path");
const fs = require("fs");

const PathResolve = require("./resolve");

/**
 * Returns a list of all available videos in the videos directory.
 * @returns {array} - An array of video file names.
 */
async function listAllAvailableVideos() {
  const availableVideos = await fs.readdirSync(PathResolve.paths.videos).filter((file) => {
    return path.extname(file).toLowerCase() === ".mp4";
  });

  return availableVideos;
}

/**
 * Retrieves the default story file.
 * @returns {Promise<Object>} A promise that resolves to the default story file object.
 */
async function getDefaultStoryFile() {
  try {
    const story = await fs.readFileSync(PathResolve.paths.manualStory, "utf8");
    return JSON.parse(story);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        "The default story file is not defined, please, copy 'static/manual_story.json.default' to 'static/manual_story.json' or change .env STORY_BY_GPT=true"
      );
    } else {
      throw err;
    }
  }
}

async function getStoryData(storyId = null) {
  const storyPath = path.join(PathResolve.paths.stories, `${storyId}.json`);

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
