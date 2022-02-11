import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { userDataInterface } from './Users';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { Constants } from 'src/app/constants';
import { MatDialog } from '@angular/material/dialog';
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

  eventcbisVerified = new Subject<any>();
  eventcbisVerified$ = this.eventcbisVerified.asObservable();

  eventcbIsOTPCompleted = new Subject<any>();
  eventcbIsOTPCompleted$ = this.eventcbIsOTPCompleted.asObservable();

  encryptedToken = localStorage.getItem('token');

  baseUrl = Constants.baseURL;

  OTP: any;
  phoneNumber: any;
  isSent = false;
  isVerify = false;
  otpCompleted : boolean;

  constructor(
    private userService: userService,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
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
              console.log(jwtToken);

              this.refreshToken = res.user?.refreshToken;
              localStorage.setItem('refreshToken', JSON.stringify(this.refreshToken))
              this.eventcbRefresh.next(this.refreshToken);
              this.eventcbJWT.next(jwtToken);
              const encryptJwt = this.encryptData(jwtToken);
              localStorage.setItem('token', encryptJwt);
              this.userService.getUserById(res.user?.uid).subscribe((userdata) => {
                this.currentUserObject = userdata;
                this.phoneNumber = this.currentUserObject.phoneNumber
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
            const encryptedText = this.encryptData(res.user?.uid);
            localStorage.setItem('uid', encryptedText);
            const _uid = this.decryptData(encryptedText);
          } else {
            console.log('error');
            localStorage.clear();
            Swal.fire('Oops something went wrong', 'please log in again','error');
            this.router.navigate(['/']);
          }
      });
  }

//sign in with OTP
  // async signIn(email: string, password: string) {
  //   return await this.firebaseAuth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((res) => {
  //         if (res) {
  //           res.user?.getIdToken().then((jwtToken) => {

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

  async sendOTP(phoneNumber: any) {
    return await this.http
      .get(this.baseUrl + `/sendOTP/${phoneNumber}`)
      .toPromise()
      .then((res) => {
        this.isSent = true
      })
      .catch((err) => {
        this.isSent = false
        console.log('Error sending otp', err);
      });
  }

  async verifyOTP(phoneNumber: any, code: any) {
    return await this.http
      .get(this.baseUrl + `/sendOTP/verify/${phoneNumber}/${code}`)
      .toPromise()
      .then((res) => {
        const data: any = res;
        let stringData = JSON.stringify(data.status)
        console.log(stringData);
        if( stringData == "approved"){
          this.isVerify = true;
          this.eventcbisVerified.next(this.isVerify);
        } else if(stringData == "pending"){
          this.isVerify = false
          this.eventcbisVerified.next(this.isVerify);
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i>Invalid OTP try again.'
          );
        }
      })
      .catch((err) => {
        this.isVerify = false;
        console.log('Error sending otp', err);
      });
  }

  async openOTP(){
     await Swal.fire({
      title: 'OTP will be sent to',
      showCancelButton: false,
      showConfirmButton: true,
      allowEscapeKey:false,
      reverseButtons: false,
      confirmButtonText: 'Send OTP',
      showLoaderOnConfirm: true,
      focusConfirm: false,
      allowOutsideClick: false,
      html:
        `<input id="phoneNumber" placeholder="Phone number" value=${this.phoneNumber} readonly class="swal2-input" maxlength="8" type="email">`,
      preConfirm: () => {
        {
          const phoneNumber: any = document.getElementById('phoneNumber');
          this.phoneNumber = phoneNumber.value;
          if(!this.phoneNumber){
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i>Phone number cannot be empty'
            );
          }
         else if(this.phoneNumber.length < 8){
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> Invalid phone number'
            );
          }
        }
      },
    }).then((res)=>{
      if(res.isConfirmed){
        this.sendOTP(this.phoneNumber).then((res)=>{
          console.log(res);
          if(this.isSent == false){
            Swal.fire({
              title:'Error',
              text:'Error sending OTP',
              icon:'error',
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Send Again',
            }).then((res)=>{
              if(res.isConfirmed){
                this.openOTP();
              }
            })
          }else{
            Swal.fire({
              title: 'OTP',
              showCancelButton: false,
              showConfirmButton: true,
              allowEscapeKey:false,
              reverseButtons: false,
              confirmButtonText: 'Verify OTP',
              showLoaderOnConfirm: true,
              focusConfirm: false,
              allowOutsideClick: false,
              html:
              `<input id="OTP" placeholder="OTP" class="swal2-input" maxlength="6" type="email">`,
              preConfirm: () =>{
                const _OTP: any = document.getElementById('OTP');
                this.OTP = _OTP.value
                if(!this.OTP){
                  Swal.showValidationMessage(
                    'OTP cannot be empty'
                  )
                }
                else if(this.OTP.length < 6){
                  'Invalid OTP'
                }
              }
            }).then((res)=>{
              if(res.isConfirmed){
                this.verifyOTP(this.phoneNumber, this.OTP)
                  this.eventcbisVerified$.subscribe((verified)=>{
                    if (verified = true){
                      this.eventcbIsOTPCompleted.next(true);
                      Swal.fire('success','OTP verified', 'success');
                      this.router.navigate(['list']);
                    }
                    else{
                      this.eventcbIsOTPCompleted.next(false);
                      Swal.showValidationMessage('Invalid OTP')
                    }
                  })
              }
            })
          }
        })
      }
    })
  }
}
