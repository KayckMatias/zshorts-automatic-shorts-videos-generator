require("dotenv").config();

const Logger = require("./src/utils/logger");
const Story = require("./src/shorts/story");
const Short = require("./src/shorts/short");

const ffmpeg = require("fluent-ffmpeg");

async function newStory() {
  Logger.info("------------ STARTING NEW SHORT ------------");

  const storyId = await new Story().makeStory().buildStoryNarration();

  const shortGenerated = await new Short(storyId).makeNewShortVideo();

  Logger.info("------------ ENDING OF NEW SHORT ------------");
}

newStory();
