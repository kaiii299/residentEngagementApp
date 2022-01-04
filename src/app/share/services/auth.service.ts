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
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable()
export class Authservice implements OnInit {
  userInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  authState: any = null;
  currentLogedInUserId: any;
  currentLogedInUserName: string;
  currentUserObject: any;
  newUserId: any;
  userLoggedIn: boolean;
  secretKey = 'YourSecretKeyForEncryption&Descryption';

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private storage: StorageMap
  ) {
    //this.loadUserInfo();
  }

  ngOnInit(): void {
    if (localStorage.getItem('uid')) {
      this.userLoggedIn = true;
    }
    this.userLoggedIn = false;
    console.log(this.userLoggedIn);
  }

  signIn(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
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
      return userRef.set(data, { merge: true }); //allows users to keep existing data
    })
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
    return this.db.collection('Users').valueChanges();
  }

  getUserById(id: any) {
    return this.db.doc(`Users/${this.currentLogedInUserId}`).valueChanges();
  }

  async forgetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then((res) => {});
  }

  encryptData(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decryptData(textToDecrypt: any) {
    var bytes = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim());
    this.currentLogedInUserId = bytes.toString(CryptoJS.enc.Utf8);
  }

  //   loadUserInfo() {
  //     const userData = this.userInfo.getValue();
  //     if (!userData) {
  //       const accessToken = localStorage.getItem("access_token")
  //       if (accessToken) {
  //         const decryptedUser = this.jwtHelper.decodeToken(accessToken);
  //         const data = {
  //           access_token: accessToken,
  //           refresh_token: localStorage.getItem("refresh_token"),
  //           username: decryptedUser.username,
  //           userid: decryptedUser.sub,
  //           tokenExpiration: decryptedUser.exp
  //         };
  //         this.userInfo.next(data);
  //       }
  //     }
  //   }

  //   userLogin(userPayload: any): Observable<boolean> {

  //     return this.http.post("http://localhost:3000/login/auth", userPayload).pipe(
  //       map((value: any) => {
  //         if (value) {
  //           localStorage.setItem("access_token", value.access_token);
  //           localStorage.setItem("refresh_token", value.refresh_token);
  //           const decryptedUser = this.jwtHelper.decodeToken(value.access_token);

  //           const data = {
  //             access_token: value.access_token,
  //             refresh_token: value.refresh_token,
  //             username: decryptedUser.username,
  //             userid: decryptedUser.sub,
  //             tokenExpiration: decryptedUser.exp
  //           };

  //           this.userInfo.next(data);
  //           return true;
  //         }
  //         return false;
  //       })
  //     );
  //   }

  //   callRefreshToken(tokenPayload: any): Observable<any> {
  //     return this.http.post('http://localhost:3000/auth/login', tokenPayload);
  //   }
}
