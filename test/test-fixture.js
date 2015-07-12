'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('BabelPlugin:generators/fixture', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/fixture'))
      .withArguments('an-example')
      .withOptions({ skipInstall: true, force: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'test/fixtures/an-example/actual.js',
      'test/fixtures/an-example/expected.js'
    ]);
  });
});
