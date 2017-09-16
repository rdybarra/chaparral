require('colors');
const builder = require('./core/builder.js');

if (process.argv.length > 2 && process.argv[2] === 'clean') {
  console.log('Starting Clean'.green);

  builder.cleanAll().then(() => {
    console.log('Clean Complete'.green);
  }).catch((error) => {
    console.error('Clean Failed:'.red);
    console.error(error);
  });
} else {
  console.log('Starting Build'.green);

  builder.buildAll().then(() => {
    console.log('Build Completed Successfully!'.green);
  }).catch((error) => {
    console.error('Build Failed:'.red);
    console.error(error.toString().red);
  });
}
