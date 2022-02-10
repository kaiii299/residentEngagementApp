import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { userDataInterface } from './Users';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { Constants } from 'src/app/constants';
import { MatDialog } from '@angular/material/dialog';
import { userService } from './user.service';
import Swal from 'sweetalert2'
import { AngularFirestore } from '@angular/fire/firestore';

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

  encryptedToken = localStorage.getItem('token');

  baseUrl = Constants.baseURL;

  OTP: any;
  phoneNumber: any;
  isSent = false;
  isVerify = false;
  otpCompleted: boolean;

  constructor(
    private userService: userService,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {

  }

  async signIn(email: string, password: string) {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res) {
          res.user?.getIdToken().then((jwtToken) => {
            this.eventcbRefresh.next(this.refreshToken);
            this.eventcbJWT.next(jwtToken);
            localStorage.setItem('token', jwtToken);

            this.CurrentUser(res.user?.uid ).subscribe((userdata) => {
              this.currentUserObject = userdata;
              console.log(this.currentUserObject);
              if (
                this.currentUserObject.userData.requestStatus == "Rejected" ||
                this.currentUserObject.userData.requestStatus == "Inactive"
              ) {
                this.SwalFire('Account has been deactivated', 'error')
              } else if (this.currentUserObject.requestStatus == "Pending" ||
                this.currentUserObject.userData.requestStatus == "Inactive"
              ) {
                this.SwalFire('Account status is pending', 'error')
              }
              else {
                this.refreshToken = res.user?.refreshToken;
                localStorage.setItem('refreshToken', JSON.stringify(this.refreshToken))
                this.phoneNumber = this.currentUserObject.phoneNumber
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
          });
          const encryptedText = this.encryptData(res.user?.uid);
          localStorage.setItem('uid', encryptedText);
          const _uid = this.decryptData(encryptedText);
          // this.router.navigate(['event'])
        } else {
          console.log('error');
          localStorage.clear();
          Swal.fire('Oops something went wrong', 'please log in again', 'error');
          this.router.navigate(['/']);
        }
      });
  }

  CurrentUser(id: any){
   return this.http.get(this.baseUrl + '/currentUser/' + id) as Observable<any>;
    // return this.db.collection('Users').doc(id).valueChanges();
  }



  SwalFire(title: string, icon: string) {
    Swal.fire({
      title: title,
      html: `Contact <a href="mailto:ResidentEngagement@gmail.com">us</a> to find out more`,
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: true,
      allowEscapeKey: false,
      reverseButtons: false,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      focusConfirm: false,
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/'])
      }
    })
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
