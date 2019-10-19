/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@member.fsf.org>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */
const { generateChoices } = require('../generateChoices');

describe('generateChoices', () => {
  test('group by fav', async () => {
    const choices = generateChoices({
      fav: {
        title: 'fav',
        pkg: 'fav',
        fav: true,
      },
      more: {
        title: 'more',
        pkg: 'more',
      },
    });
    expect(choices.favChoices).toContainEqual({
      title: 'fav (fav (https://www.npmjs.com/package/fav))',
      value: 'fav',
    });
    expect(choices.moreChoices).toContainEqual({
      title: 'more (more (https://www.npmjs.com/package/more))',
      value: 'more',
    });
  });
});
