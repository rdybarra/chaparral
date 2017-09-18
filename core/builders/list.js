const fs = require('fs');
const util = require('util');
const pug = require('pug');
const rimraf = require('rimraf');

const POST_PATH = 'posts';
const DESTINATION_PATH = 'public';
const TEMPLATES_PATH = 'templates/pages';

const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

class ListBuilder {

  clean() {
    return this.cleanList();
  }

  cleanList() {
    return new Promise((resolve) => {
      rimraf('./public/index.html', resolve);
    });
  }

  async build() {
    let configFiles = await this.getPostConfigFiles();

    let postInfo = [];
    configFiles.forEach((configFile) => {
      postInfo.push({
        title: configFile.title,
        url: configFile.url
      });
    });

    const homeTemplate = pug.compileFile(TEMPLATES_PATH + '/home.pug');
    let list = homeTemplate({
      posts: postInfo
    });

    return await writeFile(DESTINATION_PATH + '/index.html', list);
  }

  async getPostConfigFiles() {
    let promiseArray = [];
    let postFolders = await readdir(POST_PATH);

    postFolders.forEach((postFolder) => {
      promiseArray.push(this.getConfigFileFromPostFolder(postFolder));
    });

    return Promise.all(promiseArray);
  }

  async getConfigFileFromPostFolder(postFolder) {
    let configFile = await readFile(POST_PATH + '/' + postFolder + '/config.json', 'utf8');
    return JSON.parse(configFile);
  }
}

module.exports = new ListBuilder();
