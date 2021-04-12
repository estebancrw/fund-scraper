/* eslint-env browser */

function queryAllPools(project) {
  const logElement = document.querySelector("#log");
  const hrefNotIdSelector = "a[href]:not([id])";
  const hrefElements = Array.from(
      logElement.querySelectorAll(hrefNotIdSelector),
  );

  const pools = hrefElements
  // only if it doesn't end with ']' nor is Etherscan
      .filter((hrefElement) => {
        const href = hrefElement.textContent;

        return !href.endsWith("]") && href !== "Etherscan" && href !== "Staking Contract";
      })
  // get pool content
      .map((hrefElement) => {
        const nameText = hrefElement.textContent;
        let aprText = "0";
        let priceTvlText = "0";

        let element = hrefElement.nextSibling;
        while (element) {
          const text = element.textContent.trim();

          if (text.startsWith("Price")) {
            priceTvlText = text;
          }

          if (text.startsWith("APR")) {
            aprText = text;
            break;
          }

          element = element.nextSibling;
        }

        const name = nameText.replace("/", "-");
        const aprTextYear = aprText.split(" ").pop();
        const aprYear = parseFloat(aprTextYear);
        const tvlText = priceTvlText.split(" ").pop().replace(/[$,]/g, '');
        const tvl = parseFloat(tvlText);

        return {
          aprYear,
          name,
          project,
          tvl,
        };
      });

  return pools;
}

module.exports = queryAllPools;
