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
  timeoutSeconds: 400,
  memory: "4GB",
};
const schedule = "every day 06:00";
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

const vfatPools0To20 = vfatPools(0, 20);
const vfatPools20To40 = vfatPools(20, 40);
const vfatPools40To60 = vfatPools(40, 60);
const vfatPools60To80 = vfatPools(60, 80);
const vfatPools80To100 = vfatPools(80, 100);

exports.vfatPools0To20 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools0To20);

exports.vfatPools20To40 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools20To40);

exports.vfatPools40To60 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools40To60);

exports.vfatPools60To80 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools60To80);

exports.vfatPools80To100 = functions
  .runWith(runtimeOptions)
  .pubsub
  .schedule(schedule)
  .timeZone(timezone)
  .onRun(vfatPools80To100);
