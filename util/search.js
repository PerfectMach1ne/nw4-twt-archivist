// Mostly retyped from face-hh/tweetfree because I am smoothbrained
// I honestly barely understand anything that goes on down there.
const EventEmitter = require('events'); // Node.js EventEmitter module for handling events
const fs = require('fs'); // Node.js file system

module.exports = class Collector extends EventEmitter {
  constructor(client, delay) {
    super(client);

    this.client = client;
    this.stop = false;
    this.mentions = [];
    this.delay = delay || 3000;
    this.file = fs.readFileSync('util/search_scrape.js', 'utf-8');

    // Node.js setInterval()
    // Repeatedly execute a function after a specified delay
    this.interval = setInterval(async () => {
      await this.getTweets();
    }, delay);
  }

  async stopListening() {
    // Node.js clearInterval()
    // Seems self-explanatory
    clearInterval(this.interval);
    this.stop = true;
    /* Synchronously calls each of the listeners registered for the event named eventName, 
      in the order they were registered, passing the supplied arguments to each.

      Returns true if the event had listeners, false otherwise.
    */
    this.emit('stop', 'Stopped by code.');
    // tweetEmitter.on('stop', ( (reason) => console.log(reason) ));
  }

  async getTweets() {
    if (this.stop === true) return;

    const activeURL = await this.client.page.url();
    const url = `https://twitter.com/search?q=%40${this.client.username}&src=typed_query&f=live`;

    if (activeURL !== url) {
      await this.client.page.goto(url);
    } else {
      const searchBar = await this.client.page.$x(this.client.xpaths.search_bar);
      await searchBar[0].focus();
      await searchBar[0].press('Enter');
    }

    await this.client.page.waitForXPath(this.client.xpaths.search_results);

    const content = await this.client.page.evaluate(this.file);

    const newMentions = content.filter(mention => {
      return !this.mentions.find(prevMention => {
        return prevMention.author === mention.author && prevMention.content === mention.content;
      });
    });
    this.mentions = content;

    newMentions.forEach(mention => {
      if (this.stop === true || mention.content === '') return;
      this.emit('tweetCreate', mention);
    });
  }


}