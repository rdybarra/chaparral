const postBuilder = require('./builders/posts.js');
const listBuilder = require('./builders/list.js');

builder = {
  buildAll: function() {
    let promiseArray = [];
    promiseArray.push(postBuilder.build());
    promiseArray.push(listBuilder.build());

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
