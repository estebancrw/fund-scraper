const fp = require('lodash/fp');
const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const shouldSkip = fp.includes(['font', 'image', 'stylesheet', 'script']);

function Browser() {
  let browser;

  const launch = async () => {
    const params = {
      args: ['--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    }

    browser = await puppeteer.launch(params);
  };

  const open = async (url, pageOptions = {}) => {
    const options = {
      timeout: 30000,
      waitUntil: 'networkidle2',
      ...pageOptions,
    };

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      const type = request.resourceType()

      if (shouldSkip(type)) {
        request.abort()
      } else {
        request.continue()
      }
    })

    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('net::ERR_FAILED')) {
        return
      }
      console.log(text)
    })
    
    await page.goto(url, options);

    return page;
  };

  const openSlow = async (url) => {
    const options = {
      waitUntil: 'networkidle0',
      timeout: 180000,
    };

    const page = await open(url, options);
    // await sleep(5000);

    return page;
  }

  const close = async () => {
    await browser.close();
  }

  return {
    close,
    launch,
    open,
    openSlow,
  };
}

module.exports = Browser;
