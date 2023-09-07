/**
 * Formats a value by padding it with a fill string to a specified maximum length.
 *
 * @param {string} value - The value to be formatted.
 * @param {int} maxLength - The maximum length of the formatted value. Default is 2.
 * @param {string} fillString - The string used to pad the value. Default is "0".
 * @returns The formatted value.
 */
function formatPadStart(value, maxLenght = 2, fillString = "0") {
  return String(value).padStart(maxLenght, fillString);
}

/**
 * Formats the current date and time.
 *
 * @returns {string} The formatted date and time.
 */
function formatDate() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = formatPadStart(currentDate.getMonth() + 1);
  const day = formatPadStart(currentDate.getDate());
  const hours = formatPadStart(currentDate.getHours());
  const minutes = formatPadStart(currentDate.getMinutes());
  const seconds = formatPadStart(currentDate.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  formatDate,
  formatPadStart,
};
