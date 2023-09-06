const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const Logger = require("../utils/logger");
const { PathResolve } = require("../utils/resolve");

async function overrideWithAcceleratedNarration(id, speed = "1.5") {
  const currentNarrationPath = path.join(PathResolve.narrations, `${id}.mp3`);

  Logger.debug(`Accelerating "${currentNarrationPath}"`);

  try {
    await ffmpeg(currentNarrationPath)
      .audioFilter("atempo=1.5")
      .output(currentNarrationPath)
      .run();
  } catch (err) {
    console.log(err);
    Logger.error(err.msg);
  }

  return true;
}

module.exports = {
  overrideWithAcceleratedNarration,
};
