const Logger = require("../utils/logger");
const { listAllAvailableVideos } = require("../utils/helpers");
const { makeSubtitleForStory } = require("../services/subtitle");
const {
  makeShortVideo,
  joinShortVideoWithAudio,
} = require("../services/ffmpeg");

class Short {
  constructor(storyId) {
    this.storyId = storyId;
  }

  /**
   * Makes a new short video.
   *
   * @returns {Promise<string>} The path of the joined short video with audio.
   */
  async makeNewShortVideo() {
    const randomVideo = await this.#getVideoRandomCut();

    if (process.env.SUBTITLE_ENABLED == "true") {
      await makeSubtitleForStory(this.storyId);
    }

    await makeShortVideo(randomVideo, this.storyId);

    return await joinShortVideoWithAudio(this.storyId);
  }

  /**
   * Get a random cut of a video.
   * @returns {Promise<string | false>} A randomly selected video URL or false if no videos are available.
   */
  async #getVideoRandomCut() {
    const videosAvailable = await listAllAvailableVideos();

    if (videosAvailable.length == 0) {
      const error = "No videos available to make shorts, aborting...";
      Logger.error(error);

      return false;
    }


    return videosAvailable[Math.floor(Math.random() * videosAvailable.length)];
  }
}

module.exports = Short;
