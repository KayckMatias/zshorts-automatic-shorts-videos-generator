const path = require("path");
const fs = require("fs");

const Logger = require("./logger");

class PathResolve {
  static rootDir = path.join(__dirname, "../../");
  static paths = {
    narrations: path.join(this.rootDir, "tmp/narrations/"),
    shortVideos: path.join(this.rootDir, "tmp/shorts_videos/"),
    subtitles: path.join(this.rootDir, "tmp/subtitles/"),
    stories: path.join(this.rootDir, "tmp/stories/"),
    logs: path.join(this.rootDir, "logs/"),
    videos: path.join(this.rootDir, "static/videos/"),
    manualStory: path.join(this.rootDir, "static/manual_story.json"),
    generatedShorts: path.join(this.rootDir, "generated/shorts/"),
  };

  /**
   * Ensures that a directory exists at the given path.
   *
   * @param {string} directoryPath - The path of the directory to ensure.
   * @returns {Promise<void>} - A promise that resolves when the directory is ensured.
   */
  static async ensureDirectoryExists(directoryPath) {
    try {
      await fs.accessSync(directoryPath, fs.constants.F_OK);
    } catch (err) {
      if (directoryPath[directoryPath.length - 1] === path.sep) {
        await fs.mkdirSync(directoryPath, { recursive: true });
      }
    }
  }

  /**
   * Ensures that the directories specified in the paths object are created.
   * @returns Promise<void>
   */
  static async initializePaths() {
    const pathKeys = Object.keys(this.paths);
    await Promise.all(
      pathKeys.map((key) => this.ensureDirectoryExists(this.paths[key]))
    );
  }
}

module.exports = PathResolve;
