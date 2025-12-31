function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value >= 1;
}

module.exports = {
  isNonEmptyString,
  isPositiveInteger,
};
