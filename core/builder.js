const postBuilder = require('./builders/posts.js');
const listBuilder = require('./builders/list.js');

builder = {
  buildAll: function() {
    let promiseArray = [];
    promiseArray.push(listBuilder.build());
    promiseArray.push(postBuilder.build());

    // return Promise.all(promiseArray).then((done) => {
    //   console.log('Build complete');
    // }).catch((error) => {
    //   console.error('There was problem building files.');
    //   console.error(error);
    // });

    return Promise.all(promiseArray);
  },

  cleanAll: function() {
    let promiseArray = [];
    promiseArray.push(postBuilder.clean());
    promiseArray.push(listBuilder.clean());

    return Promise.all(promiseArray);
  }
}

module.exports = builder;
