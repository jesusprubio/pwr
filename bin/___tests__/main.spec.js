/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@member.fsf.org>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */
const { selectTool } = require('../main');

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
