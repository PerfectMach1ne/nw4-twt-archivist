const { exec, spawn } = require('node:child_process');
const fs = require('fs');

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
  // "3000" - the delay between each search fetch
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

  // ReferenceError: Cannot access 'client' before initialization (so before init() I assume)
  const tweetEmitter = new twtListener(client, 3000);

  // 16/04/2023 ~13:52 GOT IT TO WORK
  // EPIC WIN
  // await client.tweet({ content: 'test 123'});

  // keep track of the stopping reason
  tweetEmitter.on('stop', ( (reason) => console.log(reason) ))
}

main().then( () => process.exit(0), e => { console.error(e); process.exit(1) } );
