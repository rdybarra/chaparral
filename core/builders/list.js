const fs = require('fs');
const util = require('util');
const pug = require('pug');
const rimraf = require('rimraf');

const POST_PATH = 'posts';
const DESTINATION_PATH = 'public';

class listBuilder {

  clean() {
    return this.cleanList();
  }

  cleanList() {
    return new Promise((resolve, reject) => {
      rimraf('./public/index.html', resolve);
    });
  }

  async build() {
    let readdir = util.promisify(fs.readdir);
    let fileNames = await readdir(POST_PATH);

    const homeTemplate = pug.compileFile('./templates/pages/home.pug');
    let list = homeTemplate({
      posts: fileNames
    });

    let writeFile = util.promisify(fs.writeFile);
    return await writeFile(DESTINATION_PATH + '/index.html', list);
  }
}

module.exports = new listBuilder();
