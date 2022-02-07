import { DoBootstrap, Injectable, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { filter, map, retry, switchMap, take } from 'rxjs/operators';
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
import { Constants } from 'src/app/constants';
import { MatDialog } from '@angular/material/dialog';
import { confirmationDialog } from '../confirmatonDialog';

@Injectable()
export class Authservice implements OnInit {
  userInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  currentLogedInUserId: any;
  currentLogedInUserName: string;
  currentUserObject: any;
  newUserId: any;
  userLoggedIn: boolean;
  authState: any;
  secretKey = Constants.secretKey;

  eventCallbackuserName = new Subject<string>(); //source
  eventCallbackuserName$ = this.eventCallbackuserName.asObservable();

  eventcbFilterData = new Subject<Object>();
  eventcbFilterData$ = this.eventcbFilterData.asObservable();

  eventcbJWT = new Subject<any>();
  eventcbJWT$ = this.eventcbJWT.asObservable();

  eventcbUserData = new Subject<any>();
  eventcbUserData$ = this.eventcbUserData.asObservable();

  encryptedToken = localStorage.getItem("token");

  baseUrl = Constants.baseURL;

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(){
  }

  async signIn(email: string, password: string) {
    return await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
      if(res){
          res.user?.getIdToken().then((jwtToken) => {
          // console.log(jwtToken);
          const encryptJwt = this.encryptData(jwtToken);
          localStorage.setItem("token", encryptJwt)
          this.getUserById(res.user?.uid).subscribe((userdata)=>{
            this.currentUserObject = userdata
            this.eventCallbackuserName.next(this.currentUserObject.userData.userName);
            var encryptedRole = this.encryptData(this.currentUserObject.userData.role);
            localStorage.setItem("role", encryptedRole);
            this.eventCallbackuserName.next(userdata.userData.userName)
            var encryptedCommittee = this.encryptData(this.currentUserObject.userData.committee);
            localStorage.setItem("committee", encryptedCommittee);
          });
          this.getAllUsers();
        })
        const encryptedText = this.encryptData(res.user?.uid)
        localStorage.setItem("uid", encryptedText);
        const _uid = this.decryptData(encryptedText);
        this.router.navigate(['list']);
      } else{
        console.log("error");
        localStorage.clear();
        this.router.navigate(['/'])
        this.dialog.open(confirmationDialog,{
          data:{
            message: "Error signing in",
            reload: false
          }
        })
      }
    });
  }

  async getAllUsers() {
    return await this.http.get(this.baseUrl + "/getAllUsers").toPromise().then((data) => {
      this.eventcbUserData.next(data);
      const encryptUserData = this.encryptData(JSON.stringify(data));
      localStorage.setItem("userData", encryptUserData);
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err) {
          console.log(err);
          console.log("user not loged in");
           localStorage.clear();
           this.router.navigate(['/']);
        }
      }
    })
  }

  getUserbyFilter(category: any, keyword: any) {
    this.http.get(this.baseUrl + "/search/" + category + "/" + keyword).toPromise().then((data) => {
      console.log(data);
      this.eventcbFilterData.next(data);
    })
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  async updateUserData(uid: any ,data: any) {
    return await this.http.put(this.baseUrl + "/updateUser/" + uid, data, {responseType: 'text'}).toPromise().then((data)=>{
      console.log(data);
    })
  }

  async register(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userinfo) => {
        this.newUserId = userinfo.user?.uid;
      });
  }

  createNewUser(_userData: any) {
    return this.db.collection("Users").doc(this.newUserId).set(_userData);
  }

  createNewRequestUser(_userData: any){
    return this.db.collection("Requests").add(_userData);
  }

    getUserById(id: any){
      return this.http.get(this.baseUrl + "/getUsers/" + id) as Observable<any>
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

  deleteUserbyId(uid: any) {
    console.log(uid);
    this.http.delete(this.baseUrl + "/deleteUser/" + uid).toPromise().then(() => {
      console.log("User DELETED");
    }).catch(err => {
      console.log("There is an error", err)
    });
    if (uid != this.currentLogedInUserId) {
      this.goback
    }
    else {
      localStorage.clear()
    }
  }

}
