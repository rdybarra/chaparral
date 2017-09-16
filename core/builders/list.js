const fs = require('fs');
const pug = require('pug');
const rimraf = require('rimraf');

class listBuilder {

  clean() {
    return this.cleanList();
  }

  cleanList() {
    return new Promise((resolve, reject) => {
      rimraf('./public/index.html', () => {
        resolve();
      });
    });
  }

  build() {
    return new Promise((resolve, reject) => {
      var path = 'posts';

      const homeTemplate = pug.compileFile('./templates/pages/home.pug');

      fs.readdir(path, function(err, fileNames) {
          console.log(fileNames);

          let list = homeTemplate({
            posts: fileNames
          });

          fs.writeFile("./public/index.html", list, function(err) {
            if(err) {
                reject(err);
            }

            console.log("The file was saved!");
            resolve();
          });
      });
    });
  }

}

module.exports = new listBuilder();
