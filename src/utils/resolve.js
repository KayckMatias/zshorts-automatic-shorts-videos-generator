const path = require('path');
const { getRootDir } = require("./helpers");

class PathResolve {
  static narrations = path.join(getRootDir(), "/tmp/narrations/");
  static short_videos = path.join(getRootDir(), "/videos/");
  static generated_shorts = path.join(getRootDir(), "/generated/shorts/");
}

module.exports = { PathResolve };
