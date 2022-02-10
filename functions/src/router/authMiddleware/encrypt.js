/* eslint-disable no-unused-vars */
const functions = require("firebase-functions");
const express = require("express");
const CryptoJS = require("crypto-js");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase, 'encrypt data');

const secretKey = functions.config().twilio.testauthtoken;
