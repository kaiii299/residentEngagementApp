/* eslint-disable no-undef */
'use strict';
/* eslint-disable no-unused-vars */
const morgan = require('morgan');
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);
// eslint-disable-next-line camelcase
const SENDGRID_API_KEy = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEy);

const userDb = admin.firestore().collection("Users");
const residentDb = admin.firestore().collection("residents");
const _authMiddleware = require('./authMiddleware.js');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// app.use(_authMiddleware);
app.use(morgan('tiny'));
app.options('*', cors());
app.options('/deleteUser/:id', cors());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/getAllUsers", async (req, res) => {
  const users = [];
  const snapshot = await userDb.get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    users.push({id, data});
  });
  res.status(200).send(users);
});

app.get("/getUsers/:id", async (req, res) => {
  const snapshot = await userDb.doc(req.params.id).get();
  const uid = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send({id: uid, userData});
});

app.get("/search/:category/:keyword", async (req, res)=>{
  const _users = [];
  const category = req.params.category;
  const keyword = req.params.keyword;
  const snapshot = await userDb.where(category, '==', keyword).get();
  // if not == to empty
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    _users.push({id, data});
  });
  res.status(200).send( _users);
});

app.post("/createUser", async (req, res) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  const userData = req.body.userData;
  const uid = req.body.uid;
  await userDb.doc(uid).add(userData);
  res.status(201).send("User created successfully", userData);
});

app.put("/updateUser/:uid", async (req, res) => {
  const userData = req.body.userData;
  const uid = req.params.uid;
  await userDb.doc(uid).update(userData);
  res.status(200).send("User successfully updated");
});

app.delete("/deleteUser/:id", async (req, res) => {
  await admin.auth().deleteUser(req.params.id).then(()=>{
    res.status(200).send("Both Success");
  }).catch((err)=>{
    res.status(500).send("Both Failed");
  }).then(()=>{
    userDb.doc(req.params.id).delete().then(()=>{
      console.log("Success Deleting User Data");
      res.status(500).send("Success Deleting User Data");
    }).catch((err)=>{
      console.log("Error Deleting User Data");
      res.status(500).send("Error Deleting User Data");
    });
  });
});

app.get("/getAllResidents", async (req, res) => {
  const residents = [];
  const snapshot = await residentDb.get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    residents.push({id, data});
  });
  res.status(200).send(residents);
});

app.get("/getResident/:id", async (req, res) => {
  const snapshot = await residentDb.doc(req.params.id).get();
  const resid = snapshot.id;
  const residentData = snapshot.data();

  res.status(200).send({id: resid, residentData});
});

app.put("/updateResident/:id", async (req, res) => {
  const residentData = req.body;
  const snapshot = residentDb.doc(req.params.id);
  await snapshot.update(residentData);
  res.status(200).send("Resident data has been successfully updated");
});

app.post("/searchResidentByName", async (req, res) => {
  const residents = [];
  const searchKeyword = req.body.keyword;
  const snapshot = await residentDb.where('residentName', '>=', searchKeyword).where('residentName', '<=', searchKeyword+ '~').get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    residents.push({id, data});
  });
  res.status(200).send(residents);
});

app.post("/filterResident", async (req, res) => {
  const residents = [];
  const reqBody = req.body;
  if ( reqBody.committee && reqBody.blkNum && reqBody.ageGp ) {
    const snapshot = await residentDb.where('committee', '==', reqBody.committee).where('blkNum', '==', reqBody.blkNum).where('ageGp', '==', reqBody.ageGp).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if ( reqBody.committee && reqBody.blkNum && !reqBody.ageGp ) {
    const snapshot = await residentDb.where('committee', '==', reqBody.committee).where('blkNum', '==', reqBody.blkNum).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if ( reqBody.committee && !reqBody.blkNum && reqBody.ageGp ) {
    const snapshot = await residentDb.where('committee', '==', reqBody.committee).where('ageGp', '==', reqBody.ageGp).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if ( !reqBody.committee && !reqBody.blkNum && reqBody.ageGp ) {
    const snapshot = await residentDb.where('ageGp', '==', reqBody.ageGp).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if ( reqBody.committee && !reqBody.blkNum && !reqBody.ageGp ) {
    const snapshot = await residentDb.where('committee', '==', reqBody.committee).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  res.status(200).send(residents);
});


exports.api = functions.https.onRequest(app);

exports.onUserCreatedSendEmail = functions.firestore.document("Users/{userId}").onCreate((snap, context) => {
  const user = snap.data();
  const msg = {
    to: user.email,
    from: 'residentappv2@gmail.com',
    templateId: 'd-41f5040dd8e14b659ac15a5baba8adb0', // user created template
    dynamic_template_data: {
      Subject: 'User Created Successfully!',
      name: user.userName,
    },
  };
  sgMail.send(msg).then(() => {
    console.log(`Email sent to ${user.email}`);
  }).catch((err) => {
    console.log("There is an error sending Email" + err);
  });
});

exports.onUserDeletedSendEmail = functions.firestore.document("Users/{userId}").onDelete((snap, context) => {
  const user = snap.data();
  const msg = {
    to: user.email,
    from: 'residentappv2@gmail.com',
    templateId: 'd-7d1024f85eac4282ad4bc2ea19540c3b', // delete template
    dynamic_template_data: {
      Subject: 'User Deleted Successfully!',
      name: user.userName,
    },
  };
  sgMail.send(msg).then(() => {
    console.log(`Email sent to ${user.email}`);
  }).catch((err) => {
    console.log("There is an error sending Email" + err);
  });
});
