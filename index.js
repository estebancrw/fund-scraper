const fp = require('lodash/fp');
const pLimit = require('p-limit');
const Browser = require('./browser');
const VfatTools = require('./vfat-tools');

const limit = pLimit(3);
const wallet = '0x0dD16908663523E03C11C0dC14FA4276C1010a6b';

(async () => {
  const browser = Browser();
  await browser.launch();

  const vfatTools = VfatTools({browser, wallet});
  const links = await vfatTools.getAllLinks();
  console.log(links);

  const limitedLinks = links.slice(0,2);

  console.log(`Getting pools ${links}`);
  const poolsLists = await Promise.all(
    limitedLinks.map(
      (link) => limit(() => vfatTools.getPools(link))
    )
  );
  // const pools = fp.flatten(poolsLists);
  // fp.pickBy(fp.identity)(pools)
  // const sortedPools = fp.sortBy('aprYear')(pools);
  const pools = fp
    .chain(poolsLists)
    .flatten()
    .sortBy('aprYear')
    .value();
  console.log(pools);

  await browser.close();
})();
