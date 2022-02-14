/* eslint-disable new-cap */
const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const userDb = admin.firestore().collection("Users");
router.use(express.json());
const {allowedUsers} = require('./authMiddleware/roleMiddleware');


router.post("/", allowedUsers(['Admin', 'CC staff', 'Key Ccc Members', 'RN Manager', 'key RN Members', 'Normal RN Members']), async (req, res)=>{
  const users = [];
  const reqBody = req.body;
  const committee = reqBody.committee;
  const blockNumber = reqBody.blockNumber;
  const role = reqBody.role;
  const status = reqBody.status;
  const requestStatus = reqBody.requestStatus;
  // 5 everything present
  if (committee && blockNumber && role && status && requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('role', '==', role)
        .where('status', '==', status)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // 4
  if (committee && blockNumber && !role && status && requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('status', '==', status)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && blockNumber && role && !status && requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('role', '==', role)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && blockNumber && role && status && !requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('role', '==', role)
        .where('status', '==', status)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // 3
  if (!committee && !blockNumber && role && status && requestStatus) {
    const snapShot = await userDb
        .where('role', '==', role)
        .where('status', '==', status)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // no committee means no block number
  if (committee && blockNumber && !role && !status && requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && blockNumber && !role && status && !requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('status', '==', status)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && blockNumber && role && !status && !requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .where('role', '==', role)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // 2
  if (!committee && !blockNumber && !role && status && requestStatus) {
    const snapShot = await userDb
        .where('status', '==', status)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (!committee && !blockNumber && role && !status && requestStatus) {
    const snapShot = await userDb
        .where('role', '==', role)
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (!committee && !blockNumber && role && status && !requestStatus) {
    const snapShot = await userDb
        .where('role', '==', role)
        .where('status', '==', status)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && blockNumber && !role && !status && !requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .where('blockNumber', '==', blockNumber)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // 1
  if (!committee && !blockNumber && !role && !status && requestStatus) {
    const snapShot = await userDb
        .where('requestStatus', '==', requestStatus)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (!committee && !blockNumber && !role && status && !requestStatus) {
    const snapShot = await userDb
        .where('status', '==', status)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (!committee && !blockNumber && role && !status && !requestStatus) {
    const snapShot = await userDb
        .where('role', '==', role)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  if (committee && !blockNumber && !role && !status && !requestStatus) {
    const snapShot = await userDb
        .where('committee', '==', committee)
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  // 0
  if (!committee && !blockNumber && !role && !status && !requestStatus) {
    const snapShot = await userDb
        .get();
    snapShot.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      users.push({id, data});
    });
  }
  res.status(200).send(users);
});

// router.post('/NormalRn')
module.exports = router;
