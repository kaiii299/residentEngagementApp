/* eslint-disable no-unused-vars */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const express = require('express');
// const cookieParser = require('cookie-parser')();
admin.initializeApp(functions.config().firebase);
// eslint-disable-next-line camelcase
const SENDGRID_API_KEy = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEy);

const userDb = admin.firestore().collection("Users");
// const _authMiddleware = require('./authMiddleware.js');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-ALlow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
  origin: "*",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}));

// const isLogedIn = async (req, res, next) => {
//   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
//     res.status(403).send('Unauthorized');
//     return;
//   }
//   const idToken = req.headers.authorization.split('Bearer ')[1];
//   try {
//     const decodedIdToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedIdToken;
//     next();
//     return;
//   } catch (e) {
//     res.status(403).send('Unauthorized');
//     return;
//   }
// };

// app.use(isLogedIn);

app.get("/getAllUsers", async (req, res) => {
  const snapshot = await userDb.get();
  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, data});
  });

  res.status(200).send(JSON.stringify(users));
});

app.get("getUserById/:id", async (req, res) => {
  const snapshot = await userDb.doc(req.params.id).get();

  const uid = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send({id: uid, userData});
});

app.post("createUser/", async (req, res)=>{
  const user = req.body;

  await userDb.add(user);
  res.status(201).send("User created successfully", user);
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  await userDb.doc(req.params.id).update(body);

  res.status(200).send("User successfully updataed");
});


app.delete("deleteUser/:id", async (req, res) => {
  await admin.auth().deleteUser(req.params.id).then(() => {
    userDb.doc(req.params.id).delete();
    res.status(200).send("User data deleted successfully");
  }).catch((err) => {
    console.log("error deleting user data", err);
    res.status(500).send("Error deleting user Data");
  });
  res.status(200).send("User deleted successfully");
});

exports.api = functions.https.onRequest(app);

exports.onUserCreatedSendEmail = functions.firestore.document("Users/{userId}").onCreate((snap, context) => {
  const user = snap.data();
  const msg = {
    to: user.email,
    from: 'residentappv2@gmail.com',
    templateId: 'd-41f5040dd8e14b659ac15a5baba8auserDb0', // user created template
    dynamic_template_data: {
      Subject: 'User Created Successfully!',
      name: user.userName,
    },
  };
  sgMail.send(msg).then(() => {
    console.log(`Email sent to ${user.email}`);
  }).catch((err) => {
    console.log("There is an error sending Email", err);
  });
});

exports.onUserDeletedSendEmail = functions.firestore.document("Users/{userId}").onDelete((snap, context) => {
  const user = snap.data();
  const msg = {
    to: user.email,
    from: 'residentappv2@gmail.com',
    templateId: 'd-7d1024f85eac4282ad4bc2ea19540c3b ', // delete template
    dynamic_template_data: {
      Subject: 'User Deleted Successfully!',
      name: user.userName,
    },
  };
  sgMail.send(msg).then(() => {
    console.log(`Email sent to ${user.email}`);
  }).catch((err) => {
    console.log("There is an error sending Email", err);
  });
});


