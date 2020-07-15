'use strict';
var Generator = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');

function stripBabelPlugin(str) {
  return str.replace(/^babel-plugin-/, '');
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {};
  }

  prompting() {
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
      when: !this.pkg.keywords
    }];

    this.prompt(prompts).then(function (props) {
      this.props = _.extend(this.props, props);

      this.props.githubRepoName = 'babel-plugin-' + this.props.name;

      if (props.githubUsername) {
        this.props.repository = props.githubUsername + '/' + this.props.githubRepoName;
      }

      if (props.keywords) {
        this.props.keywords = _.uniq(_.words(props.keywords).concat(['babel-plugin']));
      }

      done();
    }.bind(this));
  }

  writing() {
    var pkgJsonFields = {
      name: this.props.githubRepoName,
      version: '0.0.0',
      description: this.props.description,
      repository: this.props.repository,
      license: this.props.license,
      author: this.props.authorName + ' <' + this.props.authorEmail + '>',
      main: 'lib/index.js',
      dependencies: {
        'babel-runtime': '^6.9.2'
      },
      devDependencies: {
        'babel-cli': '^6.9.0',
        'babel-core': '^6.9.0',
        'babel-plugin-transform-runtime': '^6.9.0',
        'babel-preset-es2015': '^6.9.0',
        'babel-preset-stage-0': '^6.5.0',
        'babel-register': '^6.9.0',
        mocha: '^2.5.3'
      },
      "scripts": {
        "clean": "rm -rf lib",
        "build": "babel src -d lib",
        "test": "mocha --compilers js:babel-register",
        "test:watch": "npm run test -- --watch",
        "prepublish": "npm run clean && npm run build"
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
  }

  default() {
    this.composeWith(require.resolve('../fixture/'), { arguments: 'example' });
  }

  install() {
    this.installDependencies();
  }
};
