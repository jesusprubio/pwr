const path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const spawn = require('await-spawn');
const { version } = require('../package.json');
const { generateChoices } = require('./generateChoices');

async function selectTool(favChoices, moreChoices) {
  let selection;
  selection = await prompts([
    {
      type: 'select',
      name: 'value',
      message: `${chalk.yellow('⚡')} ${chalk.magenta.bold(`pwr`)}`,
      choices: favChoices,
      hint: `'esc' to quit (v${version})`,
    },
  ]);
  if (selection.value && selection.value === 'more') {
    selection = await prompts([
      {
        type: 'select',
        name: 'value',
        message: `${chalk.yellow('⚡')} ${chalk.magenta.bold(`pwr`)}`,
        choices: moreChoices,
        hint: `'esc' to quit (v${version})`,
      },
    ]);
  }
  return selection.value;
}

async function main(tools) {
  const { favChoices, moreChoices } = generateChoices(tools);

  const selected = await selectTool(favChoices, moreChoices);

  let { param, comm } = tools[selected];
  if (!comm) {
    throw new Error(`Command not found for '${selected}'`);
  }
  // Accepted arrays or single object for convenience.
  if (param && !Array.isArray(param)) {
    param = [param];
  }
  if (!Array.isArray(comm)) {
    comm = [comm];
  }
  const params = await prompts(param);
  comm.forEach(async command => {
    const { bin } = command;
    let { args } = command;
    // Also accepting single objects here for convenience.
    if (args) {
      if (!Array.isArray(args)) {
        args = [args];
      }
    } else {
      args = [];
    }
    const argsFilled = args.map(arg => {
      const argLower = arg.toLowerCase();
      if (params[argLower]) {
        return params[argLower];
      }
      return arg;
    });
    let binPath = bin;
    if (bin !== 'npm') {
      binPath = path.resolve(__dirname, '../node_modules/.bin', bin);
    }
    // Will use process .stdout, .stdin, .stderr.
    await spawn(binPath, argsFilled, { stdio: 'inherit' });
  });
}
exports.main = main;
exports.selectTool = selectTool;
