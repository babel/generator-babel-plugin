'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Create a fixture'
    });
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('actual.js'),
      this.destinationPath('test/fixtures/' + this.arguments[0] + '/actual.js')
    );
    this.fs.copy(
      this.templatePath('expected.js'),
      this.destinationPath('test/fixtures/' + this.arguments[0] + '/expected.js')
    );
    this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('test/fixtures/' + this.arguments[0] + '/.babelrc')
    );
  }
});
