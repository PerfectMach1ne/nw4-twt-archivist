const { exec, spawn } = require('node:child_process');

// https://nodejs.org/api/child_process.html#asynchronous-process-creation
function pingpongping() {
  exec('node ./util/pingpong.js', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}

// Ping to see if the screenshot HTTP server is up and responing
pingpongping();

// https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/
const { twitter } = require('./twthandler');

const client = new twitter({ debug: true });
