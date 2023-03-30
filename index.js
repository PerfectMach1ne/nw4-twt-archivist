// Ping to see if the screenshot HTTP server is up and responing
function ping() {
  fetch('http://127.0.0.1:4444')
  .then(res => {
    if (!res.ok) {
      throw new Error("Screenshot HTTP server is down.");
    }
    // If we get to this point, server is up and running.
    console.log("pong!!")
  })
  .catch(err => {
    console.error(err);
    // Something got bamboozled
  });
}

ping();