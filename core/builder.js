require('colors');
const postBuilder = require('./builders/posts.js');
const listBuilder = require('./builders/list.js');

const builder = {
  buildAll: function buildAll() {
    console.log('Starting Build'.green);
    let promiseArray = [];
    promiseArray.push(builder.cleanAll());
    promiseArray.push(listBuilder.build());
    promiseArray.push(postBuilder.build());

    Promise.all(promiseArray).then(() => {
      console.log('Build completed successfully!'.green);
    }).catch((error) => {
      console.error('Build Failed:'.red);
      console.error(error.toString().red);
    });
  },

  cleanAll: function cleanAll() {
    let promiseArray = [];
    promiseArray.push(postBuilder.clean());
    promiseArray.push(listBuilder.clean());

    Promise.all(promiseArray).then(() => {
      console.log('Clean completed successfully'.green);
    }).catch((error) => {
      console.error('Clean Failed:'.red);
      console.error(error.toString().red);
    });
  }
}

module.exports = builder;
