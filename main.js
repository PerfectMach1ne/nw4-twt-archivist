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
async function main() {
  const twt = require('./twthandler');
  const twtListener = require('./util/search');

  const client = new twt({ debug: false });

  await client.init();

  var creds;

  if (fs.existsSync('credentials.json'))
    creds = fs.readFileSync('credentials.json', 'utf-8');
  const deserializedCreds = JSON.parse(creds);

  await client.login({
    email: `${deserializedCreds.email}`,
    password: `${deserializedCreds.password}`,
    username: `${deserializedCreds.username}`
  });

  console.log('Logged in!!!');
}

main().then( () => process.exit(0), e => {console.error(e); process.exit(1) } );
