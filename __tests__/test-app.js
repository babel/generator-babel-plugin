'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('babel-plugin:app', () => {
  describe('with prompt inputs', () => {
    beforeAll((done) => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
          name: 'do-something-really-awesome',
          description: 'A plugin that does a really cool thing',
          githubUsername: 'my-username',
          authorName: 'Oswald ThatEndsWald',
          authorEmail: 'oswald@thatendswald.com',
          keywords: 'foo, bar'
        })
        .on('end', done);
    });
  
    it('creates files', () => {
      assert.file([
        '.gitignore',
        '.npmignore',
        '.travis.yml',
        '.babelrc',
        'package.json',
        'README.md',
        'src/index.js',
        '__tests__/index.js'
      ]);
    });
  
    it('populates package.json correctly', () => {
      assert.jsonFileContent('package.json', {
        name: 'babel-plugin-do-something-really-awesome',
        version: '0.0.0',
        description: 'A plugin that does a really cool thing',
        repository: 'my-username/babel-plugin-do-something-really-awesome',
        author: 'Oswald ThatEndsWald <oswald@thatendswald.com>',
        keywords: ['foo', 'bar', 'babel-plugin']
      });
    });
  });

  describe('without prompt inputs', () => {
    beforeAll((done) => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .on('end', done);
    });

    it('populates package.json correctly', () => {
      assert.jsonFileContent('package.json', {
        version: '0.0.0',
        description: undefined,
        repository: undefined,
        author: undefined,
        keywords: ['babel-plugin'],
      });
    });
  });

  describe('with only author name', () => {
    beforeAll((done) => {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
          authorName: 'Oswald ThatEndsWald'
        })
        .on('end', done);
    });

    it('omits the email part in the package.json author field', () => {
      assert.jsonFileContent('package.json', {
        author: 'Oswald ThatEndsWald',
      });
    });
  });
});
