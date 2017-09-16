const fs = require('fs');
const pug = require('pug');
const rimraf = require('rimraf');

class PostBuilder {
  clean() {
    return this.cleanPosts();
  }

  build() {
    return new Promise((resolve, reject) => {
      this.cleanPosts()
        .then(this.createPostPages.bind(this))
        .then(resolve)
        .catch(reject);
    });
  }

  cleanPosts() {
    return new Promise((resolve, reject) => {
      rimraf('./public/*', () => {
        resolve();
      });
    });
  }

  createPostPages() {
    var path = 'posts';
    var destinationPath = 'public';
    var _this = this;

    fs.readdir(path, (err, fileNames) => {

      fileNames.forEach((fileName) => {
        var destinationFolderName = _this.getFolderNameFromFileName(fileName);
        fs.mkdirSync(destinationPath + '/' + destinationFolderName);

        var fileDestination = destinationPath + '/' + destinationFolderName + '/index.html';


        const postTemplate = pug.compileFile('templates/pages/post.pug');
        fs.readFile(path + '/' + fileName, 'utf8', (err, postContent) => {
          console.log(postContent);
          if (err) throw err;
          const post = postTemplate({
            postContent: postContent
          });

          console.log(post);

          fs.writeFile(fileDestination, post, function(err) {
            if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
          });
        });

      });
    });
  }

  getFolderNameFromFileName(fileName) {
    return fileName.split('.')[0];
  }
}

module.exports = new PostBuilder();
