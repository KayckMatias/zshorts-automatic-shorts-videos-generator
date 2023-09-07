const Logger = require("../utils/logger");
const { listAllAvailableVideos } = require("../utils/helpers");
const { makeShortVideo, joinShortVideoWithAudio } = require("../services/ffmpeg");

class Short {
  constructor(storyId) {
    this.storyId = storyId;
  }

  async makeNewShortVideo() {
    const randomVideo = await this.#getVideoRandomCut();

    await makeShortVideo(randomVideo, this.storyId);

    await joinShortVideoWithAudio(this.storyId);
  }

  async #getVideoRandomCut() {
    const videosAvailable = listAllAvailableVideos();

    if (videosAvailable.length == 0) {
      const error = "No videos available to make shorts, aborting...";
      await Logger.error(error);
      
      return false;
    }

    return videosAvailable[Math.floor(Math.random() * videosAvailable.length)]; 
  }

}

module.exports = Short;
