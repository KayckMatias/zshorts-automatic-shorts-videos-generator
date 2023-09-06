const Logger = require("./src/utils/logger");
const Story = require("./src/shorts/story");

async function newStory() {
  Logger.info("------------ STARTING NEW SHORT ------------");
  await new Story().makeStory().buildStoryNarration();
  Logger.info("------------ ENDING OF NEW SHORT ------------");
}

newStory();