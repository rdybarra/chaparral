#!/usr/bin/env node

const builder = require('./core/builder.js');
const creator = require('./core/creator.js');
const program = require('commander');
const packageFile = require('./package.json');
const exec = require('child_process').exec;

program
  .version(packageFile.version)
  .description('Static site generator');

program
  .command('build')
  .alias('b')
  .description('Build the static site files.')
  .action(builder.buildAll);

program
  .command('clean')
  .alias('cl')
  .description('Clean the generated static site files.')
  .action(builder.cleanAll);

program
  .command('create <title>')
  .alias('c')
  .description('Create a new post. Put title in quotes.')
  .action(creator.createPost.bind(creator));

program
  .command('start')
  .alias('s')
  .description('Start the dev server.')
  .action(() => {
    const child = exec('./node_modules/http-server/bin/http-server -o');

    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
