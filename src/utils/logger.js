const fs = require("fs");
const path = require("path");
const { formatDate } = require("./format");
const { PathResolve } = require("./resolve");

class Logger {
  static #logFilePath = path.join(PathResolve.getRootDir(), "logs/zshorts.log");

  static #registerLog(message, level) {
    const timestamp = formatDate();
    const fullLogMessage = `[${level}] - ${timestamp}: ${message} \n`;

    console.log(fullLogMessage);
    this.#appendFile(fullLogMessage);
  }

  static #appendFile(message) {
    this.#validateLog();
    fs.appendFile(this.#logFilePath, message, (err) => {
      if (err) {
        console.error(`Error writing log: ${err}`);
      }
    });
  }

  static #validateLog() {
    if (!fs.existsSync(this.#logFilePath)) {
      try {
        fs.writeFileSync(this.#logFilePath, "");
      } catch (err) {
        console.error("Error on create log file:", err);
      }
    }
  }

  static error(message) {
    this.#registerLog(message, "ERROR");
  }

  static warning(message) {
    this.#registerLog(message, "WARNING");
  }

  static debug(message) {
    if (process.env.DEBUG === "true") {
      this.#registerLog(message, "DEBUG");
    }
  }

  static info(message) {
    this.#registerLog(message, "INFO");
  }
}

module.exports = Logger;
