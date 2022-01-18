import { DoBootstrap, Injectable, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { map, retry, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { userDataInterface } from './Users';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';

@Injectable()
export class Authservice {
  userInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  currentLogedInUserId: any;
  currentLogedInUserName: string;
  currentUserObject: any;
  newUserId: any;
  userLoggedIn: boolean;
  authState: any;
  secretKey = 'YourSecretKeyForEncryption&Descryption';
  eventCallback = new Subject<string>();//source
  eventCallback$ = this.eventCallback.asObservable();
  baseUrl = "https://us-central1-residentappv2-affc6.cloudfunctions.net/api"

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private location: Location,
  ) {
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.getUserById(user.uid)
      }
      else {
        console.log("user not sign in")
      }
    })
  }

  signIn(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
      const encryptedText = this.encryptData(res.user?.uid)
      localStorage.setItem("uid", encryptedText);
      const _uid = this.decryptData(encryptedText);
      this.getUserById(this.currentLogedInUserId).then(res => [
        res.subscribe(data => {
          const _data: any = data
          const encryptedRole = this.encryptData(_data.role)
          localStorage.setItem("role", encryptedRole)
          this.eventCallback.next(_data.userName)
        })
      ]).catch(error => {
        console.log(error)
      })
    })
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  updateUserData(data: any) {
    this.firebaseAuth.onAuthStateChanged(user => {
      const userRef: AngularFirestoreDocument<userDataInterface> = this.db.doc(
        `Users/${user?.uid}`
      );
      return userRef.set(data, { merge: true });
    })
  }

  updateUserDataByQuery(data: any, uid: any) {
    const userRef: AngularFirestoreDocument<userDataInterface> = this.db.doc(
      `Users/${uid}`
    );
    return userRef.set(data, { merge: true });
  }

  async register(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userinfo) => {
        this.newUserId = userinfo.user?.uid;
      });
  }

  createNewUser(_userData: any) {
    console.log(this.newUserId);
    return this.http.post(this.baseUrl+ "/createUser",{userData: _userData}).toPromise().then(()=>{
      console.log("User Created successfully");
    }).catch(err=>{
      console.log("error creating User",err);
    });
  }

  async getAllUsers() {
    return this.db.collection('Users').valueChanges({ idField: "uid" });
  }

  async getUserById(id: any) {
    return this.db.doc(`Users/${this.currentLogedInUserId}`).valueChanges({ idField: "uid" });
  }

  async getUserByIdParam(id: any) {
    return this.db.doc(`Users/${id}`).valueChanges({ idField: "uid" });
  }


  async forgetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then((res) => { });
  }

  encryptData(value: any) {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decryptData(textToDecrypt: any) {
    var bytes = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim());
    this.currentLogedInUserId = bytes.toString(CryptoJS.enc.Utf8);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  goback() {
    this.location.back();
  }

  deleteUserbyId(uid: any){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    console.log(uid);
    this.http.post(this.baseUrl + "/deleteUser",{uid}).toPromise().then(() =>{
      console.log("User DELETED");
    }).catch(err=>[
      console.log("There is an error", err)
    ]);
    localStorage.clear();
  }
}
