const path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const spawn = require('await-spawn');
const tlink = require('terminal-link');
const { arrayIt } = require('./utils');
const { version } = require('../package.json');

function createNPMLink(info) {
  return tlink(
    chalk.cyan(info.pkg),
    `https://www.npmjs.com/package/${info.pkg}`,
  );
}

function createTitle(info) {
  const title = chalk.bold(info.title);
  const link = createNPMLink(info);
  return `${title} (${link})`;
}

function generateChoices(tools) {
  const { fav: favChoices, more: moreChoices } = Object.entries(tools)
    .map(([value, info]) => {
      return {
        payload: {
          title: createTitle(info),
          value,
        },
        fav: info.fav,
      };
    })
    .reduce(
      ({ fav, more }, tool) => {
        if (tool.fav) {
          return { fav: [...fav, tool.payload], more };
        }
        return { more: [...more, tool.payload], fav };
      },
      {
        fav: [],
        more: [],
      },
    );

  return {
    favChoices,
    moreChoices,
  };
}

async function selectTool(favChoices, moreChoices) {
  const more = {
    title: 'More ...',
    value: 'more',
  };
  const favSelection = await prompts([
    {
      type: 'select',
      name: 'value',
      message: `${chalk.yellow('⚡')} ${chalk.magenta.bold(`pwr`)}`,
      choices: [...favChoices, more],
      hint: `'esc' to quit (v${version})`,
    },
  ]);
  if (favSelection.value && favSelection.value === more.value) {
    const moreSelection = await prompts([
      {
        type: 'select',
        name: 'value',
        message: `${chalk.yellow('⚡')} ${chalk.magenta.bold(`pwr`)}`,
        choices: moreChoices,
        hint: `'esc' to quit (v${version})`,
      },
    ]);
    return moreSelection.value;
  }
  return favSelection.value;
}

function setBinPath({ argsFilled, cmd }) {
  const { bin } = cmd;
  const binPath =
    bin === 'npm' ? bin : path.resolve(__dirname, '../node_modules/.bin', bin);
  return { binPath, argsFilled };
}

function fillArgs(params) {
  return cmd => {
    const { args = [] } = cmd;
    const argsFilled = arrayIt(args)
      .map(arg => arg.toLowerCase())
      .map(arg => (params[arg] ? params[arg] : arg));
    return { argsFilled, cmd };
  };
}

function runCmds(commands, params) {
  commands
    .map(fillArgs(params))
    .map(setBinPath)
    .forEach(async ({ binPath, argsFilled }) => {
      // Will use process .stdout, .stdin, .stderr.
      await spawn(binPath, argsFilled, { stdio: 'inherit' });
    });
}

async function main(tools) {
  const { favChoices, moreChoices } = generateChoices(tools);
  const selected = await selectTool(favChoices, moreChoices);
  const { param, comm } = tools[selected];
  if (!comm) {
    throw new Error(`Command not found for '${selected}'`);
  }
  const params = await prompts(arrayIt(param));
  runCmds(arrayIt(comm), params);
}

exports.main = main;
exports.selectTool = selectTool;
exports.runCmds = runCmds;
exports.fillArgs = fillArgs;
exports.setBinPath = setBinPath;
exports.generateChoices = generateChoices;
exports.createTitle = createTitle;
