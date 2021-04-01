function queryAllLinks() {
  const containerElement = document.querySelector('.container');
  const hrefElements = Array.from(containerElement.querySelectorAll('a[href]'));

  const hrefs = hrefElements
    // get href attribute
    .map((hrefElement) => hrefElement.getAttribute('href'))
    // only if starts with '..'
    .filter((href) => href.startsWith('..'))
    // remove '../'
    .map((href) => href.split('/')[1])

  return hrefs;
}

function queryAllPools(project) {
  const logElement = document.querySelector('#log');
  const hrefNotIdSelector = 'a[href]:not([id])';
  const hrefElements = Array.from(logElement.querySelectorAll(hrefNotIdSelector));

  const pools = hrefElements
    // only if it doesn't end with ']' nor is Etherscan
    .filter((hrefElement) => {
      const href = hrefElement.textContent;

      return !href.endsWith(']') && href !== 'Etherscan'
    })
    // get pool content
    .map((hrefElement) => {
      const name = hrefElement.textContent;
      let aprText = '0';

      let element = hrefElement.nextSibling;
      while (element) {
        const text = element.textContent;

        if (text.startsWith('APR')) {
          aprText = text;
          break;
        }

        element = element.nextSibling;
      }

      const aprTextYear = aprText.split(' ').pop();
      const aprYear = parseFloat(aprTextYear);
      console.log(`${link} ${name} ${aprYear}`);

      return {
        aprYear,
        name,
        project,
      };
    });

  return pools;
}

function VfatTools({browser, wallet}) {
  const url = 'https://vfat.tools';
  const urlAll = `${url}/all`;
  
  const getAllLinks = async () => {
    const page = await browser.open(urlAll);
    const links = await page.evaluate(queryAllLinks);

    return links;
  };

  const getPools = async (link) => {
    console.log(`Pool provider ${link}`);
    const urlPoolProvider = `${url}/${link}?addr=${wallet}`;
    const page = await browser.openSlow(urlPoolProvider);
    const pools = await page.evaluate(queryAllPools, link);

    return pools;
  };

  return {
    getAllLinks,
    getPools,
  };
}

module.exports = VfatTools;
