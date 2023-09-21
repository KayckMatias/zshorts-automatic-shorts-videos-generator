require("dotenv").config();

const Logger = require("./src/utils/logger");
const Story = require("./src/shorts/story");
const Short = require("./src/shorts/short");

const { getStoryData } = require("./src/utils/helpers");
const { formatStoryData } = require("./src/utils/format");
const { PathResolve } = require("./src/utils/resolve");

PathResolve.initializePaths();

newStory();

async function newStory() {
  Logger.info("------------ STARTING NEW SHORT ------------");

  try {
    const story = new Story();
    await story.makeStory();
    await story.buildStoryNarration();

    const shortGenerated = await new Short(story.storyId).makeNewShortVideo();

    Logger.info("Successfully generated Short in: " + shortGenerated);

    const storyData = await getStoryData(story.storyId);

    Logger.info(formatStoryData(storyData));
  } catch (e) {
    Logger.error(e);
  }
  Logger.info("------------ ENDING OF NEW SHORT ------------");
}
