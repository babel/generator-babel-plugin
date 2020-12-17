'use strict';

const Generator = require('yeoman-generator');
const path = require('path');
const _ = require('lodash');

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
    const prompts = [{
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

    return this.prompt(prompts).then((props) => {
      this.props = _.extend(this.props, props);

      this.props.githubRepoName = 'babel-plugin-' + this.props.name;

      if (props.githubUsername) {
        this.props.repository = props.githubUsername + '/' + this.props.githubRepoName;
      }

      this.props.keywords = _.uniq(_.words(props.keywords).concat(['babel-plugin']));
    });
  }

  writing() {
    const pkgJsonFields = {
      name: this.props.githubRepoName,
      version: '0.0.0',
      description: this.props.description,
      repository: this.props.repository,
      license: this.props.license,
      author: this.getAuthor(),
      main: 'lib/index.js',
      dependencies: {
        '@babel/runtime': '^7.10.5'
      },
      devDependencies: {
        '@babel/cli': '^7.10.5',
        '@babel/core': '^7.10.5',
        '@babel/plugin-transform-runtime': '^7.10.5',
        '@babel/preset-env': '^7.10.4',
        'jest': '^26.1.0'    
      },
      scripts: {
        'clean': 'rm -rf lib',
        'build': 'babel src -d lib',
        'test': 'jest __tests__/index.js',
        'test:watch': 'npm run test -- --watch',
        'prepublish': 'npm run clean && npm run build'
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
    let testIndex = this.fs.read(this.templatePath('__tests__/index.js'));
    testIndex = testIndex.replace('<%= description %>', this.props.description);
    this.fs.write(this.destinationPath('__tests__/index.js'), testIndex);
  }

  default() {
    this.composeWith(require.resolve('../fixture/'), { arguments: 'example' });
  }

  install() {
    this.npmInstall();
  }

  getAuthor() {
    if (this.props.authorName && this.props.authorEmail) {
      return `${this.props.authorName} <${this.props.authorEmail}>`;
    }

    if (this.props.authorName) {
      return this.props.authorName;
    }

    // author requires at least a name
    return undefined;
  }
};
