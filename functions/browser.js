const fp = require('lodash/fp');
const puppeteer = require('puppeteer');

const shouldSkip = fp.includes(['font', 'image', 'stylesheet', 'script']);

function Browser() {
  let browser;
  let tooManyRequests = false;

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

    await page.setRequestInterception(true)
    page.on('request', (request) => {
      const type = request.resourceType()

      if (shouldSkip(type)) {
        request.abort()
      } else {
        request.continue()
      }
    })

    page.on('response', (response) => {
      const status = response.status()

      if (status == 429) {
        tooManyRequests = true
        console.error('429 Too Many Requests')

        return
      }
    })

    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('net::ERR_FAILED')) {
        return
      }
    })

    if (tooManyRequests) {
      return
    }

    await page.goto(url, options);

    return page;
  };

  const openSlow = async (url) => {
    const options = {
      waitUntil: 'networkidle0',
      timeout: 180000,
    };

    const page = await open(url, options);

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
