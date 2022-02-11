/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const functions = require("firebase-functions");
const express = require("express");
const sendMessage = express.Router();
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase, 'sendOTP');
sendMessage.use(express.json());

const testaccountsid = functions.config().twilio.testsid;
const testAuthToken = functions.config().twilio.testauthtoken;

const accountSid = functions.config().twilio.accountsid;
const authToken = functions.config().twilio.authtoken;
const serviceID = functions.config().twilio.serviceid;

const client = require('twilio')(accountSid, authToken);

sendMessage.get('/:phoneNumber', (req, res)=>{
  const phoneNumber = `+65${req.params.phoneNumber}`;
  client
      .verify
      .services(serviceID)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms',
      }).then((data)=>{
        res.status(200).send(data);
      }).catch((err)=>{
        res.status(500).send(`Error sending OTP ${err}, ${phoneNumber}`);
      });
});

sendMessage.get('/verify/:phoneNumber/:code', (req, res)=>{
  const code = req.params.code;
  const phoneNumber = `+65${req.params.phoneNumber}`;
  client
      .verify
      .services(serviceID)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: code,
      }).then((data)=>{
        res.status(200).send(data);
      }).then((err)=>{
        res.status(500).send(`Error verifying OTP ${err}`);
      });
});
module.exports = sendMessage;
