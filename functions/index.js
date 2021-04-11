const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Browser = require("./browser");
const VfatTools = require("./vfat-tools");
const PoolRepository = require("./pool-repository");

const wallet = "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413";
admin.initializeApp();
const firestore = admin.firestore();
const poolRepository = PoolRepository(firestore);

const runtimeOptions = {
  timeoutSeconds: 500,
  memory: "4GB",
};
const schedule = "every 7 hours from 06:00 to 20:00";
const timezone = "America/Mexico_City";

const vfatPools = (startSlice, endSlice) => async (context) => {
  const browser = Browser();
  await browser.launch();

  const vfatTools = VfatTools({browser, wallet});
  const projects = await vfatTools.getAllLinks();
  const slicedProjects = projects.slice(startSlice, endSlice);
  console.log("Sliced projects:", projects);

  const pools = await vfatTools.getAllPools(slicedProjects);
  console.log("Pools:", pools);

  await browser.close();
  await poolRepository.addAll(pools);

  return {
    projects,
  };
};

const vfatPools0To25 = vfatPools(0, 25);
const vfatPools25To50 = vfatPools(25, 50);
const vfatPools50To75 = vfatPools(50, 75);
const vfatPools75To100 = vfatPools(75, 100);

exports.pools0To25 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools0To25);

exports.pools25To50 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools25To50);

exports.pools50To75 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools50To75);

exports.pools75To100 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools75To100);
