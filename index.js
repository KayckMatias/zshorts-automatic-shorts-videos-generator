const Logger = require('./src/utils/logger');
const Story = require('./src/shorts/story');

Logger.info('------------ STARTING NEW SHORT ------------');
new Story().makeStory().buildStoryNarration();
Logger.info('------------ ENDING OF NEW SHORT ------------');