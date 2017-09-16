const fs = require('fs');
const util = require('util');
const pug = require('pug');
const rimraf = require('rimraf');

const POST_PATH = 'posts';
const DESTINATION_PATH = 'public';
const TEMPLATES_PATH = 'templates/pages';

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
    let readdir = util.promisify(fs.readdir);
    let fileNames = await readdir(POST_PATH);

    const homeTemplate = pug.compileFile(TEMPLATES_PATH + '/home.pug');
    let list = homeTemplate({
      posts: fileNames
    });

    let writeFile = util.promisify(fs.writeFile);
    return await writeFile(DESTINATION_PATH + '/index.html', list);
  }
}

module.exports = new ListBuilder();
