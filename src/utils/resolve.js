const path = require('path');

class PathResolve {
    static narrations = path.join(this.getRootDir(), "/tmp/narrations/");
    static short_videos = path.join(this.getRootDir(), "/tmp/shorts_videos/");
    static stories = path.join(this.getRootDir(), "/tmp/stories/");
    static videos = path.join(this.getRootDir(), "/static/videos/");
    static manual_story = path.join(this.getRootDir(), "/static/manual_story.json");
    static generated_shorts = path.join(this.getRootDir(), "/generated/shorts/");

  static getRootDir() {
    return path.join(__dirname, "../../");
  }
}

module.exports = { PathResolve };
