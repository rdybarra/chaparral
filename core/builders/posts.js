const fs = require('fs');
const util = require('util');
const pug = require('pug');
const rimraf = require('rimraf');

const POST_PATH = 'posts';
const DESTINATION_PATH = 'public';
const TEMPLATES_PATH = 'templates/pages';

class PostBuilder {
  clean() {
    return this.cleanPosts();
  }

  build() {
    return this.createPostPages();
  }

  cleanPosts() {
    return new Promise((resolve) => {
      rimraf(DESTINATION_PATH + '/*', () => {
        resolve();
      });
    });
  }

  async createDestinationFolder(destinationPath, fileName) {
    const destinationFolderName = this.getFolderNameFromFileName(fileName);
    const mkdir = util.promisify(fs.mkdir);
    await mkdir(destinationPath + '/' + destinationFolderName);

    return destinationFolderName;
  }

  async createPostPages() {
    let promiseArray = [];
    const readdir = util.promisify(fs.readdir);
    let fileNames = await readdir(POST_PATH);

    fileNames.forEach((fileName) => {
      promiseArray.push(this.generatePostFromFile(fileName));
    });

    await Promise.all(promiseArray);
  }

  async generatePostFromFile(fileName) {
    let destinationFolderName = await this.createDestinationFolder(DESTINATION_PATH, fileName);

    let fullPathToTargetFile = DESTINATION_PATH + '/' + destinationFolderName + '/index.html';

    let readFile = util.promisify(fs.readFile);
    let srcContents = await readFile(POST_PATH + '/' + fileName, 'utf8');
    let postContent = this.compileFileContents(srcContents);

    let writeFile = util.promisify(fs.writeFile);

    return await writeFile(fullPathToTargetFile, postContent);
  }

  compileFileContents(srcContents) {
    const postTemplate = pug.compileFile(TEMPLATES_PATH + '/post.pug');
    return postTemplate({
      postContent: srcContents
    });
  }

  getFolderNameFromFileName(fileName) {
    return fileName.split('.')[0];
  }
}

module.exports = new PostBuilder();
