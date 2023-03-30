const puppeteer = require('puppeteer');

// https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/
module.exports = class Twitter {
  constructor({ debug }) {
    // For being able to see what's going on in the browser via GUI
    this.debug = debug;
    
    this.xpaths = {
      'modal_helper': '//*[@id="modal-header"]/span/span',

      // Click on <div id="layers" class="r-1d2f490 r-u8s1d r-zchlnj r-ipm5af" style="z-index: 1;">
      // Click copy and select XPath
      // It copies //*[@id="layers"]
      // Use this as a stable starting point (based on my little smoothbrained research)
      // 6 plain <div>s
      // Then select the 2nd <div> (there's 3 there last time i checked), then select another 2nd,
      // then select a few divs without branches until you have to go for the 2nd one again,
      // and repeat this as if you were clicking on <div> in browser inspect feature on the Twitter
      // login page, in search of the input, which is what is at the end of this path. This is how this works.
      'login_password': '//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input',
    };
    this.defaultDelay = { delay: 57 }; // Delay for typing slower

    this.browser = null;
    this.page = null;
  }

  async init() {
    const options = { headless: true }

    if (this.debug) options.headless = false;

    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

    await this.page.goto('https://twitter.com/home/');
  }

  async inputPassword(password) {
    const passwordInput = await this.page.waitForXPath(this.xpaths.login_password, { visible: true });
    // { visible: true } in waitForXPath() lore:
    // Wait for the selected element to be present in DOM and to be visible, i.e. to not have
    // display: none or visibility: hidden CSS properties.

    await passwordInput.type(password, this.defaultDelay); // Delay for typing slower
  }

  async xpathToContent(xpath) {

  }

  async login({ username, password, email }) {
    this.username = username;
    this.password = password;
    this.email = email;

    const modal = await this.xpathToContent('modal_helper');

    if (!modal.includes('Sign in')) return;
    await this.page.goto('https://twitter.com/i/flow/login');
  }
}