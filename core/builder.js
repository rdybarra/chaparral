const postBuilder = require('./builders/posts.js');
const listBuilder = require('./builders/list.js');

const builder = {
  buildAll: function buildAll() {
    let promiseArray = [];
    promiseArray.push(listBuilder.build());
    promiseArray.push(postBuilder.build());

    return Promise.all(promiseArray);
  },

  cleanAll: function cleanAll() {
    let promiseArray = [];
    promiseArray.push(postBuilder.clean());
    promiseArray.push(listBuilder.clean());

    return Promise.all(promiseArray);
  }
}

module.exports = builder;
