require("dotenv").config();

const Logger = require("./src/utils/logger");
const Story = require("./src/shorts/story");
const Short = require("./src/shorts/short");

async function newStory() {
  Logger.info("------------ STARTING NEW SHORT ------------");

  try {
    const story = new Story();
    await story.makeStory();
    await story.buildStoryNarration();

    const shortGenerated = await new Short(story.storyId).makeNewShortVideo();

    Logger.info("Successfully generated Short in: " + shortGenerated);
  } catch (e) {
    Logger.error(e);
  }
  Logger.info("------------ ENDING OF NEW SHORT ------------");
}

newStory();
