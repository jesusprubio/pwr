/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@gmail.com>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const { selectTool, generateChoices, createTitle } = require('../bin/main');

jest.mock('prompts');
// eslint-disable-next-line import/order
const prompts = require('prompts');

describe('selectTool', () => {
  test('select a fav', async () => {
    prompts.mockReturnValueOnce(Promise.resolve({ value: 'test' }));

    const a = await selectTool(
      [
        {
          title: 'test',
          value: 'test',
        },
        {
          title: 'More ...',
          value: 'more',
        },
      ],
      [
        {
          title: 'extra',
          value: 'extra',
        },
      ],
    );
    expect(a).toBe('test');
  });

  test('select other', async () => {
    prompts
      .mockReturnValueOnce(Promise.resolve({ value: 'more' }))
      .mockReturnValueOnce(Promise.resolve({ value: 'extra' }));

    const a = await selectTool(
      [
        {
          title: 'test',
          value: 'test',
        },
        {
          title: 'More ...',
          value: 'more',
        },
      ],
      [
        {
          title: 'extra',
          value: 'extra',
        },
      ],
    );
    expect(a).toBe('extra');
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
    expect(choices.favChoices).toContainEqual({
      title: createTitle(tools.fav),
      value: 'fav',
    });
    expect(choices.moreChoices).toContainEqual({
      title: createTitle(tools.more),
      value: 'more',
    });
  });
});
