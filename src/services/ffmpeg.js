const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const Logger = require("../utils/logger");
const { PathResolve } = require("../utils/resolve");

async function overrideWithAcceleratedNarration(id, speed = "1.5") {
  const currentNarrationPath = path.join(PathResolve.narrations, `${id}.mp3`);
  const acceleratedPath = currentNarrationPath + ".accelerated.mp3";

  Logger.debug(`Accelerating "${currentNarrationPath}"`);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(currentNarrationPath)
        .audioFilter("atempo=1.5")
        .saveToFile(acceleratedPath)
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          return reject(new Error(err));
        });
    });

    await fs.renameSync(acceleratedPath, currentNarrationPath);

    // await promisify(
    //   ffmpeg(currentNarrationPath)
    //     .audioFilter(`atempo=${speed}`)
    //     .saveToFile(acceleratedPath)
    // );
    // await fs.promises.rename(acceleratedPath, currentNarrationPath);
  } catch (err) {
    Logger.error(err.msg);
  }

  Logger.debug(`"${id}" Accelerated!`);

  return true;
}

async function makeShortVideo(video, storyId) {
  const randomVideoPath = path.join(PathResolve.videos, `${video}`);

  const videoDuration = await getVideoDuration(randomVideoPath);
  const [min, max] = [0, videoDuration - 120];
  const randomStart = Math.floor(Math.random() * (max - min + 1) + min);

  const savePath = path.join(PathResolve.short_videos, `${storyId}.mp4`);

  Logger.debug(
    `Generating short video for "${storyId}" starting from ${randomStart} seconds using video "${video}"...`
  );

  await new Promise((resolve, reject) => {
    ffmpeg(randomVideoPath)
      .setStartTime(randomStart)
      .duration(60)
      .noAudio()
      .output(savePath)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        return reject(new Error(err));
      })
      .run();
  });

  Logger.debug(`"${storyId}" Short video generated!`);
}

async function joinShortVideoWithAudio(storyId) {
  const videoPath = path.join(PathResolve.short_videos, `${storyId}.mp4`);
  const audioPath = path.join(PathResolve.narrations, `${storyId}.mp3`);
  const savePath = path.join(PathResolve.generated_shorts, `${storyId}.mp4`);

  Logger.debug(`Joining short video with audio for "${storyId}"...`);

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .addInput(audioPath)
      .output(savePath)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        return reject(new Error(err));
      })
      .run();
  });

  Logger.debug(`"${storyId}" Short video joined!`);
}

async function getVideoDuration(path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        reject(err);
      }

      resolve(metadata.format.duration);
    });
  });
}

module.exports = {
  overrideWithAcceleratedNarration,
  makeShortVideo,
  joinShortVideoWithAudio
};
