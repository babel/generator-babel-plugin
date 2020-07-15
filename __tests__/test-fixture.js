'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('BabelPlugin:generators/fixture', () => {
  beforeAll((done) => {
    helpers.run(path.join(__dirname, '../generators/fixture'))
      .withArguments('an-example')
      .withOptions({ skipInstall: true, force: true })
      .on('end', done);
  });

  it('creates files', () => {
    assert.file([
      'test/fixtures/an-example/actual.js',
      'test/fixtures/an-example/expected.js'
    ]);
  });
});
