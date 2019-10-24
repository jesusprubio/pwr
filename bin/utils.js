/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@member.fsf.org>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

exports.arrayIt = arg => {
  if (arg && !Array.isArray(arg)) {
    return [arg];
  }

  return arg;
};
