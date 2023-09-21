const fs = require("fs");
const path = require("path");

const { nodewhisper } = require("nodejs-whisper");

const Logger = require("../utils/logger");
const PathResolve = require("../utils/resolve");

/**
 * Generates a subtitle for a given story.
 *
 * @param {string} storyId - The ID of the story.
 * @returns {Promise<void>} - A promise that resolves when the subtitle is generated.
 */
async function makeSubtitleForStory(storyId) {
  Logger.debug(`Generating subtitle for "${storyId}"`);

  const narrationsPath = path.join(PathResolve.paths.narrations, `${storyId}.mp3`);

  await nodewhisper(narrationsPath, {
    modelName: process.env.SUBTITLE_WHISPER_MODEL,
    autoDownloadModelName: process.env.SUBTITLE_WHISPER_MODEL,
    whisperOptions: {
      outputInSrt: true,
    },
  });

  await organizePath(storyId);

  Logger.debug(`Subtitle generated for "${storyId}"`);
}

/**
 * Moves the subtitle file and deletes the generated WAV file for a given story ID.
 *
 * @param {string} storyId - The ID of the story.
 * @returns {Promise<boolean>} - A promise that resolves to true if the operation is successful.
 */
async function organizePath(storyId) {
  const subtitleWavGenerated = path.join(
    PathResolve.paths.narrations,
    `${storyId}.wav`
  );
  const subtitleOldPath = path.join(
    PathResolve.paths.narrations,
    `${storyId}.wav.srt`
  );
  const subtitleNewPath = path.join(PathResolve.paths.subtitles, `${storyId}.srt`);

  await fs.renameSync(subtitleOldPath, subtitleNewPath);
  await fs.unlinkSync(subtitleWavGenerated);

  return true;
}

module.exports = { makeSubtitleForStory };
