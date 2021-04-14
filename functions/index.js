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

const vfatPools0To10 = vfatPools(0, 10);
const vfatPools10To20 = vfatPools(10, 20);
const vfatPools20To30 = vfatPools(20, 30);
const vfatPools30To40 = vfatPools(30, 40);
const vfatPools40To50 = vfatPools(40, 50);
const vfatPools50To60 = vfatPools(50, 60);
const vfatPools60To70 = vfatPools(60, 70);
const vfatPools70To80 = vfatPools(70, 80);
const vfatPools80To90 = vfatPools(80, 90);
const vfatPools90To100 = vfatPools(90, 100);

const firebaseFunction = (fn) => (
  functions
    .runWith(runtimeOptions)
    .pubsub
    .schedule(schedule)
    .timeZone(timezone)
    .onRun(fn)
)

exports.vfatPools0To10 = firebaseFunction(vfatPools0To10)
exports.vfatPools10To20 = firebaseFunction(vfatPools10To20)
exports.vfatPools20To30 = firebaseFunction(vfatPools20To30)
exports.vfatPools30To40 = firebaseFunction(vfatPools30To40)
exports.vfatPools40To50 = firebaseFunction(vfatPools40To50)
exports.vfatPools50To60 = firebaseFunction(vfatPools50To60)
exports.vfatPools60To70 = firebaseFunction(vfatPools60To70)
exports.vfatPools70To80 = firebaseFunction(vfatPools70To80)
exports.vfatPools80To90 = firebaseFunction(vfatPools80To90)
exports.vfatPools90To100 = firebaseFunction(vfatPools90To100)
