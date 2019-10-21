#!/usr/bin/env node

/**
 * @license
 *
 * Copyright (c) 2019, Jesús Rubio <jesusprubio@member.fsf.org>
 *
 * This source code is licensed under the MIT License found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const escExit = require('esc-exit');
const { main } = require('./main');
const tools = require('../tools');

escExit();

main(tools)
  // The CLIs print their own output.
  .then(() => {})
  .catch();
