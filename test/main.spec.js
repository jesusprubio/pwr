/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@gmail.com>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const globalDirs = require('global-dirs');
const path = require('path');

const npm = require.resolve(path.join(globalDirs.npm.binaries, 'npm'));
const mockNpx = jest.fn();
mockNpx.parseArgs = jest.fn();

jest.mock('inquirer');
jest.mock('await-spawn', () => jest.fn());
jest.mock('import-from', () => (fromDirectory, moduleId) => {
  if (moduleId === 'libnpx') return mockNpx;
  return jest.requireActual('import-from')(fromDirectory, moduleId);
});

/* eslint-disable import/order */
const inquirer = require('inquirer');
const spawn = require('await-spawn');
/* eslint-enable */

const { runCommands, generateChoices, selectTool } = require('../bin/main');

describe('selectTool', () => {
  const choices = {
    fav: [
      {
        name: 'test',
        value: 'test',
      },
      {
        name: 'More ...',
        value: 'more',
      },
    ],
    more: [
      {
        name: 'extra',
        value: 'extra',
      },
    ],
  };

  test('select a fav', async () => {
    inquirer.prompt.mockReturnValueOnce(Promise.resolve({ value: 'test' }));

    const tool = await selectTool(choices);
    expect(tool).toBe('test');
  });

  test('select other', async () => {
    inquirer.prompt
      .mockReturnValueOnce(Promise.resolve({ value: 'more' }))
      .mockReturnValueOnce(Promise.resolve({ value: 'extra' }));

    const tool = await selectTool(choices);
    expect(tool).toBe('extra');
  });
});

describe('generateChoices', () => {
  const tools = {
    fav: {
      title: 'fav',
      pkg: 'fav',
      fav: true,
    },
    more: {
      title: 'more',
      pkg: 'more',
    },
  };

  test('group by fav', async () => {
    const choices = generateChoices(tools);
    expect(
      choices.fav.find(({ name }) => name.includes('npmjs.com/package/fav')),
    ).toBeTruthy();
    expect(
      choices.more.find(({ name }) => name.includes('npmjs.com/package/more')),
    ).toBeTruthy();
  });
});

describe('runCommands', () => {
  const tools = {
    publish: {
      title: 'Publish to npm',
      pkg: 'np',
      comm: [{ bin: 'npm', args: ['pack', '--dry-run'] }, { bin: 'np' }],
      fav: true,
    },
  };

  test('publish', async () => {
    await runCommands(tools.publish.comm);
    expect(spawn).toHaveBeenCalledWith(
      process.argv0,
      [npm, 'pack', '--dry-run'],
      { stdio: 'inherit' },
    );
    expect(mockNpx.parseArgs).toHaveBeenCalledWith(
      [...process.argv, '--quiet', 'np'],
      npm,
    );
  });
});
