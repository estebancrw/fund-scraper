const fp = require("lodash/fp");
const pLimit = require("p-limit");
const queryAllLinks = require("./query-all-links");
const queryAllPools = require("./query-all-pools");

const limit = pLimit(5);

function VfatTools({browser, wallet}) {
  const url = "https://vfat.tools";
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

    let pools = []
    if (page) {
      pools = await page.evaluate(queryAllPools, link);
    }

    return pools;
  };

  const getAllPools = async (links) => {
    const poolsP = links.map(
      (link) => limit(() => getPools(link)),
    );
    const pools = await Promise.all(poolsP);

    return fp.flatten(pools);
  };

  return {
    getAllLinks,
    getAllPools,
    getPools,
  };
}

module.exports = VfatTools;
