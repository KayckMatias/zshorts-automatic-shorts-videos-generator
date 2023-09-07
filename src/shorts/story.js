const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const gTTS = require("gtts");

const Logger = require("../utils/logger");
const ChatGpt = require("../services/chatgpt");
const { PathResolve } = require("../utils/resolve");
const { getDefaultStoryFile } = require("../utils/helpers");
const { overrideWithAcceleratedNarration } = require("../services/ffmpeg");

class Story {
  storyId;
  story;

  constructor() {
    this.storyId = randomUUID();
  }

  async makeStory() {
    let storyGenerated = null;

    if (process.env.STORY_BY_GPT == "true") {
      const chatGptClient = new ChatGpt();
      storyGenerated = await chatGptClient.createNewStory();
    }else{
      storyGenerated = await getDefaultStoryFile();
    }

    this.#saveStory(storyGenerated);
    this.story = storyGenerated.story;

    return this;
  }

  async buildStoryNarration() {
    const gtts = new gTTS(this.story, "pt-br");

    Logger.debug(`Narration from history "${this.storyId}" generated`);

    try {
      await this.#saveNarration(gtts);

      await overrideWithAcceleratedNarration(this.storyId);
    } catch (e) {
      Logger.error(e);
    }

    return this.storyId;
  }

  #saveStory(storyToSave) {
    const pathToSave = path.join(PathResolve.stories, `${this.storyId}.json`);
    const storyStringify = JSON.stringify(storyToSave);

    fs.writeFile(pathToSave, storyStringify, (err) => {
      if (err) {
        Logger.error(`Error on save Story "${this.storyId}"`);
      } else {
        Logger.debug(`Story "${this.storyId}" saved in ${pathToSave}`);
      }
    });
  }

  #saveNarration(narration) {
    const pathToSave = path.join(PathResolve.narrations, `${this.storyId}.mp3`);
    
    const storyId = this.storyId;
    return new Promise((resolve, reject) => {
      narration.save(pathToSave, function (err, result) {
        if (err) {
          reject(err);
        }
        Logger.debug(
          `Narration "${storyId}" saved in ${PathResolve.narrations}`
        );
        resolve(true);
      });
    });
  }
}

module.exports = Story;
