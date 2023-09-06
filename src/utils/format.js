function formatPadStart(value, maxLenght = 2, fillString = "0") {
  return String(value).padStart(maxLenght, fillString);
}

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
