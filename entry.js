const builder = require('./core/builder.js');

if (process.argv.length > 2 && process.argv[2] === 'clean') {
  builder.cleanAll().then(() => {
    console.log('Clean Complete');
  }).catch((error) => {
    console.error('Clean Failed:');
    console.error(error);
  });
} else {
  builder.buildAll().then(() => {
    console.log('Build Completed Successfully!');
  }).catch((error) => {
    console.error('Build Failed:');
    console.error(error);
  });
}
