'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var npmName = require('npm-name');

function stripBabelPlugin(str) {
  return str.replace(/^babel-plugin-/, '');
}

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {};
  },

  prompting: function () {
    var self = this;
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Plugin Name',
      default: stripBabelPlugin(path.basename(process.cwd())),
      filter: function(name) {
        return _.kebabCase(stripBabelPlugin(name));
      },
      validate: function (input) {
        return !!input.length;
      },
      when: !this.pkg.name
    }, {
      name: 'description',
      message: 'Description',
      when: !this.pkg.description
    }, {
      name: 'githubUsername',
      message: 'GitHub username or organization',
      when: !this.pkg.repository
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      when: !this.pkg.author,
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      when: !this.pkg.author,
      store: true
    }, {
      name: 'keywords',
      message: 'Key your keywords (comma to split)',
      when: !this.pkg.keywords,
      filter: function(keywords) {
        return _.uniq(_.words(keywords).concat(['babel-plugin']))
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = _.extend(this.props, props);

      this.props.githubRepoName = 'babel-plugin-' + this.props.name;

      if (props.githubUsername) {
        this.props.repository = props.githubUsername + '/' + this.props.githubRepoName;
      }

      done();
    }.bind(this));
  },

  writing: function() {
    var pkgJsonFields = {
      name: this.githubRepoName,
      version: '0.0.0',
      description: this.props.description,
      repository: this.props.repository,
      license: this.props.license,
      author: this.props.authorName + ' <' + this.props.authorEmail + '>',
      main: 'dist/index.js',
      devDependencies: {
        'babel-core': '^6.3.17',
        'babel-preset-es2015': '^6.3.13',
        'babel-preset-stage-0': '^6.3.13',
        mocha: '^2.2.5'
      },
      scripts: {
        'prepublish': 'babel src/index.js > dist/index.js',
        'test': 'mocha --compilers js:babel-register'
      },
      keywords: this.props.keywords
    };

    this.fs.writeJSON('package.json', _.merge(pkgJsonFields, this.pkg));

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('npmignore'),
      this.destinationPath('.npmignore')
    );

    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );

    this.fs.copy(
      this.templatePath('travis.yml'),
      this.destinationPath('.travis.yml')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('src/index.js'),
      this.destinationPath('src/index.js'),
      this.props
    );

    // The file
    var testIndex = this.fs.read(this.templatePath('test/index.js'));
    testIndex = testIndex.replace('<%= description %>', this.props.description);
    this.fs.write(this.destinationPath('test/index.js'), testIndex);
  },

  default: function() {
    this.composeWith('babel-plugin:fixture', { arguments: 'example' }, {
      local: require.resolve('../fixture/')
    });
  },

  install: function () {
    this.installDependencies();
  }
});
