/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@gmail.com>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const { selectTool, generateChoices } = require('../bin/main');

jest.mock('inquirer');
// eslint-disable-next-line import/order
const inquirer = require('inquirer');

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
