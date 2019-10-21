function arrayIt(arg) {
  if (arg && !Array.isArray(arg)) {
    return [arg];
  }
  return arg;
}
exports.arrayIt = arrayIt;
