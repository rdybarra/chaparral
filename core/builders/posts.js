const fs = require('fs');
const util = require('util');
const pug = require('pug');
const rimraf = require('rimraf');
const showdown  = require('showdown');
const mdConverter = new showdown.Converter();

const POST_PATH = 'posts';
const DESTINATION_PATH = 'public';
const TEMPLATES_PATH = 'templates/pages';

const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

class PostBuilder {
  clean() {
    return this.cleanPosts();
  }

  cleanPosts() {
    return new Promise((resolve) => {
      rimraf(DESTINATION_PATH + '/*', () => {
        resolve();
      });
    });
  }

  build() {
    return this.createPostPages();
  }

  async createPostPages() {
    let promiseArray = [];
    let postFolders = await readdir(POST_PATH);

    postFolders.forEach((postFolder) => {
      promiseArray.push(this.createPostPage(postFolder));
    });

    return Promise.all(promiseArray);
  }

  async createPostPage(postFolder) {
    let configFile = await readFile(POST_PATH + '/' + postFolder + '/config.json', 'utf8');
    configFile = JSON.parse(configFile);

    return this.buildPostAccordingToConfigFile(postFolder, configFile);
  }

  async buildPostAccordingToConfigFile(sourceDirectory, configFile) {
    const destinationFolder = configFile.url;
    await mkdir(DESTINATION_PATH + '/' + destinationFolder);

    const contentFile = configFile.content;
    const fullPathToTargetFile = DESTINATION_PATH + '/' + destinationFolder + '/index.html';
    const srcContents = await readFile(POST_PATH + '/' + sourceDirectory + '/' + contentFile, 'utf8');

    return await writeFile(fullPathToTargetFile, this.compileFileContents(srcContents));
  }

  compileFileContents(srcContents) {
    srcContents = mdConverter.makeHtml(srcContents);

    const postTemplate = pug.compileFile(TEMPLATES_PATH + '/post.pug');
    return postTemplate({
      postContent: srcContents
    });
  }
}

module.exports = new PostBuilder();
