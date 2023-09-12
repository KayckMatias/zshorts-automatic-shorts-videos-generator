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

  /**
   * Generates a story using either ChatGpt or the default story file.
   * @returns {this}
   */
  async makeStory() {
    let storyGenerated = null;

    if (process.env.STORY_BY_GPT == "true") {
      const chatGptClient = new ChatGpt();
      storyGenerated = await chatGptClient.createNewStory();
    } else {
      storyGenerated = await getDefaultStoryFile();
    }

    const saveWithId = {
      id: this.storyId,
      ...storyGenerated,
    };

    this.#saveStory(saveWithId);
    this.story = storyGenerated.story;

    return this;
  }

  /**
   * Builds the narration for the story.
   *
   * @returns {Promise<string>} The ID of the generated story narration.
   */
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

  /**
   * Save story to a file.
   *
   * @param {Object} storyToSave - The story object JSON to save.
   * @returns {void}
   */
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

  /**
   * Save narration to a file.
   *
   * @param {gTTS} narration - The narration to save.
   * @returns {Promise<boolean>} - A promise that resolves to true if the narration is saved successfully, or rejects with an error.
   */
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
