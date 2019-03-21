const fs = require('fs').promises;
const os = require('os');
const path = require('path');

async function readGithubToken() {
  const credentials = (await fs.readFile(
    path.join(os.homedir(), '.git-credentials'),
  ))
    .toString()
    .trim();

  const token = credentials; // TODO: implement it
  return token;
}

module.exports = {
  readGithubToken,
};
