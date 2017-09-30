require('colors');
const fs = require('fs');
const util = require('util');

const POST_PATH = 'posts';

const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

const creator = {
  createPost: function createPost(title) {
    let targetDirectory;

    try {
      targetDirectory = this.createPostFolder(title);
    } catch (error) {
      console.error('Post creation failed:'.red);
      console.error(error.toString().red);
      return;
    }

    this.createPostConfigFile(targetDirectory, title).then(() => {
      this.createInitialMarkdownFile(targetDirectory, title).then(() => {
        console.log('Post created successfully!'.green);
      }).catch((error) => {
        console.error('Post creation failed:'.red);
        console.error(error.toString().red);
      });
    }).catch((error) => {
      console.error('Post creation failed:'.red);
      console.error(error.toString().red);
    });
  },

  createInitialMarkdownFile: async function createInitialMarkdownFile(targetDirectory, title) {
    return await writeFile(targetDirectory + '/' + title + '.md', '#' + title);
  },

  createPostConfigFile: async function createPostConfigFile(targetDirectory, title) {
    return await writeFile(targetDirectory + '/config.json', JSON.stringify({
      url: this.makeDirectoryName(title),
      content: title + '.md',
      title: title
    }, null, '\t'));
  },

  createPostFolder: function createPostFolder(title) {
    let targetDirectory = POST_PATH + '/' + this.makeDirectoryName(title);

    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory);
    } else {
      throw new Error('Folder already exists. Use a different name.');
    }

    return targetDirectory;
  },

  postFolderExists: async function postFolderExists(title) {
    let directory = await stat(POST_PATH + '/' + this.makeDirectoryName(title));
    return directory.isDirectory();
  },

  makeDirectoryName: function makeDirectoryName(title) {
    return title.replace(' ', '-');
  }

}

module.exports = creator;
