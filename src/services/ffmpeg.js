const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const Logger = require("../utils/logger");
const { PathResolve } = require("../utils/resolve");

/**
 * Overrides the narration with accelerated audio.
 * @param {string} id The ID of the narration.
 * @param {string} speed The speed to accelerate the audio. Default is "1.5".
 * @returns A boolean indicating whether the audio was successfully accelerated.
 */
async function overrideWithAcceleratedNarration(storyId, speed = "1.5") {
  const currentNarrationPath = path.join(
    PathResolve.narrations,
    `${storyId}.mp3`
  );
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
  } catch (err) {
    Logger.error(err.msg);
  }

  Logger.debug(`"${id}" Accelerated!`);

  return true;
}

/**
 * Generates a short video for a given story.
 * @param {string} video - The name of the video file.
 * @param {string} storyId - The ID of the story.
 * @returns {Promise<void>} - A promise that resolves when the short video is generated.
 */
async function makeShortVideo(video, storyId) {
  const audioPath = path.join(PathResolve.narrations, `${storyId}.mp3`);
  const audioDuration = (await getFileDuration(audioPath)) + 2;

  const randomVideoPath = path.join(PathResolve.videos, `${video}`);

  const videoDuration = await getFileDuration(randomVideoPath);
  const [min, max] = [0, videoDuration - audioDuration * 2];
  const randomStart = Math.floor(Math.random() * (max - min + 1) + min);

  const savePath = path.join(PathResolve.short_videos, `${storyId}.mp4`);

  Logger.debug(
    `Generating short video for "${storyId}" starting from ${randomStart} seconds using video "${video}"...`
  );

  await new Promise((resolve, reject) => {
    ffmpeg(randomVideoPath)
      .setStartTime(randomStart)
      .duration(audioDuration)
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

/**
 * Join a short video with audio.
 * @param {string} storyId - The ID of the story.
 * @returns {Promise<string>} - The path of the joined video.
 */
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

  return savePath;
}

/**
 * Retrieves the duration of a file.
 *
 * @param {string} path - The path of the file.
 * @returns {Promise<number>} - A promise that resolves to the duration of the file in seconds.
 */
async function getFileDuration(path) {
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
  joinShortVideoWithAudio,
};
