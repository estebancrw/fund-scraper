/* eslint-env browser */

function queryAllLinks() {
  const containerElement = document.querySelector(".container");
  const hrefElements = Array.from(containerElement.querySelectorAll("a[href]"));

  const hrefs = hrefElements
  // get href attribute
      .map((hrefElement) => hrefElement.getAttribute("href"))
  // only if starts with '..'
      .filter((href) => href.startsWith(".."))
  // remove '../'
      .map((href) => href.split("/")[1]);

  return hrefs;
}

module.exports = queryAllLinks;
