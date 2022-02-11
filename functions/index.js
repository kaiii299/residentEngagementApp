/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

"use strict";
const morgan = require("morgan");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const router = require('./src/router/filter');
const process = require('process');
const sendMessage = require('./src/router/sendMessage');
const CryptoJS = require("crypto-js");
const secretKey = functions.config().cryptojs.secretkey;

process.on('unhandledRejection', (error, promise) => {
  console.log('Error ', promise);
  console.log(' The error was: ', error );
});

admin.initializeApp(functions.config().firebase, 'router');
// eslint-disable-next-line camelcase
const SENDGRID_API_KEy = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEy);

const userDb = admin.firestore().collection("Users");
const residentDb = admin.firestore().collection("residents");
const _authMiddleware = require("./src/router/authMiddleware/authMiddleware.js");
const {allowedUsers} = require('./src/router/authMiddleware/roleMiddleware.js');
const surveyDb = admin.firestore().collection("surveys");

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use( _authMiddleware);
app.use(morgan("tiny"));
app.use('/filter', router);
app.use('/sendOTP', sendMessage);
app.options("*", cors());
app.options("/deleteUser/:id", cors());

// ----------------------------------------------------------------------------------------------------USERS-----------------------------------------------------------------------------------------------
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get("/getAllUsers", allowedUsers(['Admin', 'CC staff', 'Key Ccc', 'RN Manager', 'Key RN Members']), async (req, res) => {
  const Allusers = [];
  try {
    const snapshot = await userDb.get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      ['LastUpdatedDate',
        'registrationTime',
        'regsitrationDate',
        'LastUpdatedTime',
        'gender',
        'email',
        'firstName',
        'requestStatus',
        'status',
      ].forEach((e) => delete data[e]);
      Allusers.push({id, data});
    });
    res.status(200).send(Allusers);
  } catch (e) {
    res.status(500).send(`ERROR! ${someUsers}, ${e}`);
  }
});

app.get("/getAllUsers", allowedUsers(['Admin', 'CC staff', 'Key Ccc', 'RN Manager', 'Key RN Members']), async (req, res) => {
  const Allusers = [];
  try {
    const snapshot = await userDb.get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      ['LastUpdatedDate',
        'registrationTime',
        'regsitrationDate',
        'LastUpdatedTime',
        'gender',
        'email',
        'firstName',
        'requestStatus',
        'status',
      ].forEach((e) => delete data[e]); // delete all this data
      Allusers.push({id, data});
    });
    res.status(200).send(Allusers);
  } catch (e) {
    res.status(500).send(`ERROR! ${someUsers}, ${e}`);
  }
});

app.get("/currentUser/:id", async (req, res) => {
  const snapshot = await userDb.doc(req.params.id).get();
  const id = snapshot.id;
  const userData = snapshot.data();
  ['LastUpdatedDate',
    'registrationTime',
    'regsitrationDate',
    'LastUpdatedTime',
    'gender',
    'email',
    'firstName',
    'isAccepted',
  ]
      .forEach((e) => delete userData[e]);
  res.status(200).send({id, userData});
});

app.get("/getUser/:id", allowedUsers(['Admin', 'CC staff', 'Key Ccc', 'RN Manager', 'Key RN Members', 'Normal RN Members']), async (req, res) => {
  const snapshot = await userDb.doc(req.params.id).get();
  const id = snapshot.id;
  const userData = snapshot.data();
  ['LastUpdatedDate', 'registrationTime', 'regsitrationDate', 'LastUpdtedTime'].forEach((e) => delete userData[e]);
  res.status(200).send({id, userData});
});


app.post("/searchUserByName", allowedUsers(['Admin', 'CC staff', 'Key Ccc', 'RN Manager', 'Key RN Members']), async (req, res) => {
  const users = [];
  const searchKeyword = req.body.keyword;
  const snapshot = await userDb
      .where("userName", ">=", searchKeyword)
      .where("userName", "<=", searchKeyword + "~")
      .get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    users.push({id, data});
  });
  res.status(200).send(users);
});

app.put("/update/:uid", async (req, res) => {
  const userData = req.body;
  const uid = req.params.uid;
  await userDb.doc(uid).update(userData);
  res.status(200).send("User successfully updated");
});

app.delete("/deleteUser/:id", allowedUsers(["Admin", "Cc staff"]), async (req, res) => {
  await admin
      .auth()
      .deleteUser(req.params.id)
      .then(() => {
        res.status(200).send("Both Success");
      })
      .catch((err) => {
        res.status(500).send("Both Failed");
      })
      .then(() => {
        userDb
            .doc(req.params.id)
            .delete()
            .then(() => {
              console.log("Success Deleting User Data");
              res.status(500).send("Success Deleting User Data");
            })
            .catch((err) => {
              console.log("Error Deleting User Data");
              res.status(500).send("Error Deleting User Data");
            });
      });
});

// -----------------------------------------RESIDENT------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/getAllResidents", async (req, res) => {
  const residents = [];
  if (req.body.committee != null) {
    const snapshot = await residentDb.where('committee', '==', req.body.committee).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  } else {
    const snapshot = await residentDb.get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
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
  const snapshot = await residentDb
      .where("residentName", ">=", searchKeyword)
      .where("residentName", "<=", searchKeyword + "~")
      .get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    if (req.body.committee != null && req.body.blkNum != null && req.body.ageGp != null) {
      if (data.committee == req.body.committee && data.blkNum == req.body.blkNum && data.ageGp == req.body.ageGp) {
        residents.push({id, data});
      }
    } else if (req.body.committee != null && req.body.blkNum != null && req.body.ageGp == null) {
      if (data.committee == req.body.committee && data.blkNum == req.body.blkNum) {
        residents.push({id, data});
      }
    } else if (req.body.committee != null && req.body.blkNum == null && req.body.ageGp != null) {
      if (data.committee == req.body.committee && data.ageGp == req.body.ageGp) {
        residents.push({id, data});
      }
    } else if (req.body.committee == null && req.body.blkNum == null && req.body.ageGp != null) {
      if (data.ageGp == req.body.ageGp) {
        residents.push({id, data});
      }
    } else if (req.body.committee != null && req.body.blkNum == null && req.body.ageGp == null) {
      if (data.committee == req.body.committee) {
        residents.push({id, data});
      }
    } else {
      residents.push({id, data});
    }
  });
  res.status(200).send(residents);
});

app.post("/filterResident", async (req, res) => {
  const residents = [];
  const reqBody = req.body;
  if (reqBody.committee && reqBody.blkNum && reqBody.ageGp) {
    const snapshot = await residentDb
        .where("committee", "==", reqBody.committee)
        .where("blkNum", "==", reqBody.blkNum)
        .where("ageGp", "==", reqBody.ageGp)
        .get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if (reqBody.committee && reqBody.blkNum && !reqBody.ageGp) {
    const snapshot = await residentDb
        .where("committee", "==", reqBody.committee)
        .where("blkNum", "==", reqBody.blkNum)
        .get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if (reqBody.committee && !reqBody.blkNum && reqBody.ageGp) {
    const snapshot = await residentDb
        .where("committee", "==", reqBody.committee)
        .where("ageGp", "==", reqBody.ageGp)
        .get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if (!reqBody.committee && !reqBody.blkNum && reqBody.ageGp) {
    const snapshot = await residentDb.where("ageGp", "==", reqBody.ageGp).get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  if (reqBody.committee && !reqBody.blkNum && !reqBody.ageGp) {
    const snapshot = await residentDb
        .where("committee", "==", reqBody.committee)
        .get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      residents.push({id, data});
    });
  }
  res.status(200).send(residents);
});

app.post("/createSurvey", async (req, res) => {
  req.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  const surveyData = req.body;
  await surveyDb.doc().set(surveyData);
  res.status(200).send(surveyData);
});

app.get("/getSurveyByResidentId/:id", async (req, res) => {
  const surverys = [];
  const snapshot = await surveyDb.where('residentId', '==', req.params.id).get();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    surverys.push({id, data});
  });
  res.status(200).send(surverys);
});


exports.api = functions.https.onRequest(app);

exports.onUserCreatedSendEmail = functions.firestore
    .document("Users/{userId}")
    .onCreate((snap, context) => {
      const user = snap.data();
      const msg = {
        to: user.email,
        from: "residentappv2@gmail.com",
        templateId: "d-41f5040dd8e14b659ac15a5baba8adb0", // user created template
        dynamic_template_data: {
          Subject: "User Created Successfully!",
          name: user.userName,
        },
      };
      sgMail
          .send(msg)
          .then(() => {
            console.log(`Email sent to ${user.email}`);
          })
          .catch((err) => {
            console.log("There is an error sending Email" + err);
          });
    });

exports.onUserRquestedSendEmail = functions.firestore.document('Users/{userId}')
    .onUpdate((snap, context) => {
      const newValue = snap.after.data();
      const previousValue = snap.before.data();

      if (newValue.requestStatus !== previousValue.requestStatus) {
        const user = snap.data();
        const msg = {
          to: user.email,
          from: "residentappv2@gmail.com",
          templateId: "d-670dcc0a3fc4493a8a727226970ca884",
          dynamic_template_data: {
            Subject: 'Your account status has been updated',
            name: user.userName,
            requestStatus: user.requestStatus,
          },
        };
        sgMail
            .send(msg)
            .then(() => {
              console.log(`Email sent to ${user.email}`);
            })
            .catch((err) => {
              console.log("There is an error sending Email" + err);
            });
      }
    });

exports.onUserDeletedSendEmail = functions.firestore
    .document("Users/{userId}")
    .onDelete((snap, context) => {
      const user = snap.data();
      const msg = {
        to: user.email,
        from: "residentappv2@gmail.com",
        templateId: "d-7d1024f85eac4282ad4bc2ea19540c3b", // delete template
        dynamic_template_data: {
          Subject: "User Deleted Successfully!",
          name: user.userName,
        },
      };
      sgMail
          .send(msg)
          .then(() => {
            console.log(`Email sent to ${user.email}`);
          })
          .catch((err) => {
            console.log("There is an error sending Email" + err);
          });
    });


