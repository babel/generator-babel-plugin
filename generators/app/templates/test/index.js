import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';

describe('<%= description %>', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    const fixtureDir = path.join(fixturesDir, caseName);
    if (!fs.statSync(fixtureDir).isDirectory()) return;
    
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath).code;

      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();

      assert.equal(actual.trim(), expected.trim());
    });
  });
});
