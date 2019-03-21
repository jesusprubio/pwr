import ava from 'ava';
import ninos from 'ninos';
import path from 'path';
import fs from 'fs';
import { readGithubToken } from '../lib/github';

const test = ninos(ava);

test('readGithubToken returns appropriate token', async t => {
  t.context.spy(fs.promises, 'readFile', () =>
    Promise.resolve(
      fs.readFileSync(path.join(__dirname, '/fixtures/git-credentials-1.txt')),
    ),
  );

  t.is(await readGithubToken(), 'MY_TOKEN');
});
