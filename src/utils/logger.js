const fs = require("fs");
const path = require("path");
const { formatDate } = require("./format");
const PathResolve = require("./resolve");

class Logger {
  static #logFilePath = path.join(PathResolve.rootDir, "logs/zshorts.log");

  /**
   * Logs a message with a specified log level.
   *
   * @param {string} message - The message to log.
   * @param {string} level - The log level.
   * @returns {void}
   */
  static #registerLog(message, level) {
    const timestamp = formatDate();
    const fullLogMessage = `[${level}] - ${timestamp}: ${message} \n`;

    console.log(fullLogMessage);
    this.#appendFile(fullLogMessage);
  }

  /**
   * Append message to the log file.
   * @param {string} message
   * @returns {void}
   */
  static #appendFile(message) {
    this.#validateLog();
    fs.appendFile(this.#logFilePath, message, (err) => {
      if (err) {
        console.error(`Error writing log: ${err}`);
      }
    });
  }

  /**
   * Validates the log file path and creates a log file if it doesn't exist.
   * @returns {void}
   */
  static #validateLog() {
    if (!fs.existsSync(this.#logFilePath)) {
      try {
        fs.writeFileSync(this.#logFilePath, "");
      } catch (err) {
        console.error("Error on create log file:", err);
      }
    }
  }

  /**
   * Logs an error message.
   *
   * @param {string} message - The message to be logged.
   * @returns {void}
   */
  static error(message) {
    this.#registerLog(message, "ERROR");
  }

  /**
   * Logs an warning message.
   *
   * @param {string} message - The message to be logged.
   * @returns {void}
   */
  static warning(message) {
    this.#registerLog(message, "WARNING");
  }

  /**
   * Logs an debug message if debug active.
   *
   * @param {string} message - The message to be logged.
   * @returns {void}
   */
  static debug(message) {
    if (process.env.DEBUG === "true") {
      this.#registerLog(message, "DEBUG");
    }
  }

  /**
   * Logs an informational message.
   *
   * @param {string} message - The message to be logged.
   * @returns {void}
   */
  static info(message) {
    this.#registerLog(message, "INFO");
  }
}

module.exports = Logger;
