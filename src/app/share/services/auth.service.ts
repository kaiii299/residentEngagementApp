import { DoBootstrap, Injectable, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { map, retry, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { userDataInterface } from './Users';
import { ActivatedRoute, Router } from '@angular/router';
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
  authState: any = null;
  secretKey = 'YourSecretKeyForEncryption&Descryption';
  eventCallback = new Subject<string>();//source
  eventCallback$ = this.eventCallback.asObservable();

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private location: Location,
  ) {
    this.firebaseAuth.onAuthStateChanged(user=>{
      if(user){
        this.getUserById(user.uid)
      }
      else{
        console.log("user not sign in")
      }
    })
  }

  signIn(email: string, password: string){
    return this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res=>{
       const encryptedText = this.encryptData(res.user?.uid)
       localStorage.setItem("uid",encryptedText);
       const _uid = this.decryptData(encryptedText);
        this.getUserById(this.currentLogedInUserId).subscribe(data=>{
          const _data: any = data
          this.eventCallback.next(_data.userName)
        })
      }).catch(error=>{
        console.log(error)
        throw error
      })
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  updateUserData(data: any) {
    this.firebaseAuth.onAuthStateChanged(user=>{
      const userRef: AngularFirestoreDocument<userDataInterface> = this.db.doc(
        `Users/${user?.uid}`
      );
      return userRef.set(data, { merge: true });
    })
  }

  updateUserDataByQuery(data: any,uid: any) {
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

  createNewUser(UserData: any) {
    console.log(this.newUserId);
    return this.db.collection('Users').doc(this.newUserId).set(UserData);
  }

  getAllUsers() {
    return this.db.collection('Users').valueChanges({idField:"uid"});
  }

  getUserById(id: any) {
      return this.db.doc(`Users/${this.currentLogedInUserId}`).valueChanges({idField:"uid"});
  }

  getUserByIdParam(id: any){
    return this.db.doc(`Users/${id}`).valueChanges({idField:"uid"});
  }

  async forgetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then((res) => {});
  }

  encryptData(value: any) {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decryptData(textToDecrypt: any) {
    var bytes = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim());
    this.currentLogedInUserId = bytes.toString(CryptoJS.enc.Utf8);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  goback(){
    this.location.back();
  }
}
