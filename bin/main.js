/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@gmail.com>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');
const globalDirs = require('global-dirs');
const importFrom = require('import-from');
const path = require('path');
const pEachSeries = require('p-each-series');
const { prompt } = require('inquirer');
const terminalLink = require('terminal-link');
const spawn = require('await-spawn');
const { URL } = require('url');

const { castArray } = require('./utils');
const { version, peerDependencies } = require('../package.json');

const npm = require.resolve(path.join(globalDirs.npm.binaries, 'npm'));
const npx = importFrom(path.join(globalDirs.npm.packages, 'npm'), 'libnpx');

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

function generateChoices(tools) {
  return Object.entries(tools)
    .map(([value, { fav, title, pkg }]) => {
      const url = new URL(`/package/${pkg}`, 'https://npmjs.com');
      const name = chalk`{bold ${title}} ({cyan ${terminalLink(pkg, url)}})`;
      return { fav, name, value };
    })
    .reduce(
      (acc, { fav, ...tool }) => {
        if (fav) {
          acc.fav.push(tool);
        } else {
          acc.more.push(tool);
        }
        return acc;
      },
      { fav: [], more: [] },
    );
}

async function selectTool(choices) {
  const more = {
    name: 'More ...',
    value: 'more',
  };
  const options = {
    type: 'list',
    name: 'value',
    message: chalk`{yellow ⚡} {magenta.bold pwr}`,
    suffix: chalk.dim(` 'esc' to quit (v${version})`),
  };
  let selected = await prompt([
    {
      ...options,
      choices: [...choices.fav, more],
    },
  ]);
  if (selected.value && selected.value === more.value) {
    selected = await prompt([
      {
        ...options,
        choices: choices.more,
      },
    ]);
    return selected.value;
  }
  return selected.value;
}

function runCommands(commands, params = {}) {
  commands = commands.map(({ args = [], ...cmd }) => {
    args = castArray(args).map(arg => {
      arg = arg.toLowerCase();
      return hasProp(params, arg) ? params.arg : arg;
    });
    return { ...cmd, args };
  });
  return pEachSeries(commands, ({ bin, args, pkg = bin }) => {
    if (bin === 'npm') {
      // eslint-disable-next-line no-console
      console.error(chalk.dim('\n> npm %s'), args.join(' '));
      return spawn(process.argv0, [npm, ...args], { stdio: 'inherit' });
    }
    const npxArgs = ['--quiet'];
    const pkgVersion = peerDependencies[pkg];
    const spec = [pkg, pkgVersion].join('@');
    if (bin === 'yo') {
      npxArgs.push(...['-p', 'yo', '-p', spec, '--', bin, ...args]);
    } else if (bin !== pkg) {
      npxArgs.push(...['-p', spec, '--', bin, ...args]);
    } else {
      npxArgs.push(...[spec, ...args]);
    }
    // eslint-disable-next-line no-console
    console.error(chalk.dim('\n> npx %s'), npxArgs.join(' '));
    args = npx.parseArgs([...process.argv, ...npxArgs], npm);
    return npx(args);
  });
}

async function main(tools) {
  const choices = generateChoices(tools);
  const selected = await selectTool(choices);
  const { param, comm } = tools[selected];
  if (!comm) {
    throw new Error(`Command not found for '${selected}'`);
  }
  const params = param ? await prompt(castArray(param)) : undefined;
  runCommands(castArray(comm), params);
}

module.exports = {
  main,
  runCommands,
  generateChoices,
  selectTool,
};
