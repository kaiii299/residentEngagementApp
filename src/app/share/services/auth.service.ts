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
import { userService } from './user.service';
import Swal from 'sweetalert2'
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
  secretKey = Constants.secretKey;
  refreshToken: any;

  eventCallbackuserName = new Subject<string>(); //source
  eventCallbackuserName$ = this.eventCallbackuserName.asObservable();

  eventcbRole = new Subject<string>(); //source
  eventcbRole$ = this.eventcbRole.asObservable();

  eventcbJWT = new BehaviorSubject<any>("");
  eventcbJWT$ = this.eventcbJWT.asObservable();

  eventcbRefresh = new BehaviorSubject<any>("");
  eventcbRefresh$ = this.eventcbRefresh.asObservable();

  eventcbUserData = new Subject<any>();
  eventcbUserData$ = this.eventcbUserData.asObservable();

  eventcbisExist = new Subject<any>();
  eventcbisExist$ = this.eventcbisExist.asObservable();

  encryptedToken = localStorage.getItem('token');

  baseUrl = Constants.baseURL;

  constructor(
    private userService: userService,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) { }

  async signIn(email: string, password: string) {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res) {
          res.user ?.getIdToken().then((jwtToken) => {
            console.log(jwtToken);
            this.refreshToken = res.user ?.refreshToken;
            // console.log(refreshToken);
            localStorage.setItem('refreshToken', JSON.stringify(this.refreshToken))
            this.eventcbRefresh.next(this.refreshToken);
            this.eventcbJWT.next(jwtToken);
            const encryptJwt = this.encryptData(jwtToken);
            localStorage.setItem('token', encryptJwt);
            this.userService.getUserById(res.user ?.uid).subscribe((userdata) => {
              this.currentUserObject = userdata;
              console.log(this.currentUserObject);
              this.eventCallbackuserName.next(
                this.currentUserObject.userData.userName
              );
              var encryptedRole = this.encryptData(
                this.currentUserObject.userData.role
              );
              localStorage.setItem('role', encryptedRole);
              this.eventcbRole.next(userdata.userData.role);
              this.eventCallbackuserName.next(userdata.userData.userName);
              var encryptedCommittee = this.encryptData(this.currentUserObject.userData.committee);
              localStorage.setItem("committee", encryptedCommittee);
            });
          });
          const encryptedText = this.encryptData(res.user ?.uid);
          localStorage.setItem('uid', encryptedText);
          const _uid = this.decryptData(encryptedText);
          this.router.navigate(['list']);
        } else {
          console.log('error');
          localStorage.clear();
          Swal.fire('Please sign in', '', 'error');
          this.router.navigate(['/']);
        }
      });
  }


  async getAllUsers() {
    return await this.http
      .get(this.baseUrl + '/getAllUsers')
      .toPromise()
      .then((data) => {
        this.eventcbUserData.next(data);
        // const encryptUserData = this.encryptData(JSON.stringify(data));
        // localStorage.setItem("userData", encryptUserData);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err) {
            console.log(err);
            console.log('user not loged in');
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      });
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/']);
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

}
