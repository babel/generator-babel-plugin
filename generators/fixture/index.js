'use strict';

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Create a fixture'
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('actual.js'),
      this.destinationPath('__tests__/fixtures/' + this.arguments[0] + '/actual.js')
    );
    this.fs.copy(
      this.templatePath('expected.js'),
      this.destinationPath('__tests__/fixtures/' + this.arguments[0] + '/expected.js')
    );
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('__tests__/fixtures/' + this.arguments[0] + '/.babelrc')
    );
  }
}
