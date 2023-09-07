const path = require('path');

class PathResolve {
    static narrations = path.join(this.getRootDir(), "/tmp/narrations/");
    static short_videos = path.join(this.getRootDir(), "/tmp/shorts_videos/");
    static videos = path.join(this.getRootDir(), "/static/videos/");
    static generated_shorts = path.join(this.getRootDir(), "/generated/shorts/");

  static getRootDir() {
    return path.join(__dirname, "../../");
  }
}

module.exports = { PathResolve };
