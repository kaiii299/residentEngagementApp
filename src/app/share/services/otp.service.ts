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
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OTPService {

  baseUrl = Constants.baseURL;

  OTP: any;
  phoneNumber: any;
  isSent = false;
  isVerify = false;
  otpCompleted: boolean;

  eventcbisVerified = new Subject<any>();
  eventcbisVerified$ = this.eventcbisVerified.asObservable();

  eventcbIsOTPCompleted = new Subject<any>();
  eventcbIsOTPCompleted$ = this.eventcbIsOTPCompleted.asObservable();

  constructor(
    private userService: userService,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  async sendOTP(phoneNumber: any) {
    return await this.http.get(this.baseUrl + `/sendOTP/${phoneNumber}`)
      .toPromise()
      .then((res) => {
        this.isSent = true;
      })
      .catch((err) => {
        this.isSent = false;
        console.log('Error sending otp', err);
      });
  }

  async verifyOTP(phoneNumber: any, code: any) {
    return await this.http
      .get(this.baseUrl + `/sendOTP/verify/${phoneNumber}/${code}`)
      .toPromise()
      .then((res) => {
        const data: any = res;
        const stringData = JSON.stringify(data.status);
        console.log(stringData);
        if (stringData == 'approved') {
          this.isVerify = true;
          this.eventcbisVerified.next(this.isVerify);
        } else if (stringData == 'pending') {
          this.isVerify = false;
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

  async openOTP() {
    await Swal.fire({
      title: 'OTP will be sent to',
      showCancelButton: false,
      showConfirmButton: true,
      allowEscapeKey: false,
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
          if (!this.phoneNumber) {
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i>Phone number cannot be empty'
            );
          }
          else if (this.phoneNumber.length < 8) {
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> Invalid phone number'
            );
          }
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        this.sendOTP(this.phoneNumber).then((res) => {
          console.log(res);
          if (this.isSent == false) {
            Swal.fire({
              title: 'Error',
              text: 'Error sending OTP',
              icon: 'error',
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Send Again',
            }).then((res) => {
              if (res.isConfirmed) {
                this.openOTP();
              }
            });
          } else {
            Swal.fire({
              title: 'OTP',
              showCancelButton: false,
              showConfirmButton: true,
              allowEscapeKey: false,
              reverseButtons: false,
              confirmButtonText: 'Verify OTP',
              showLoaderOnConfirm: true,
              focusConfirm: false,
              allowOutsideClick: false,
              html:
                `<input id="OTP" placeholder="OTP" class="swal2-input" maxlength="6" type="email">`,
              preConfirm: () => {
                const _OTP: any = document.getElementById('OTP');
                this.OTP = _OTP.value;
                if (!this.OTP) {
                  Swal.showValidationMessage(
                    'OTP cannot be empty'
                  );
                }
                else if (this.OTP.length < 6) {
                  'Invalid OTP';
                }
              }
            }).then((res) => {
              if (res.isConfirmed) {
                this.verifyOTP(this.phoneNumber, this.OTP);
                this.eventcbisVerified$.subscribe((verified) => {
                  if (verified = true) {
                    this.eventcbIsOTPCompleted.next(true);
                    Swal.fire('success', 'OTP verified', 'success');
                    this.router.navigate(['list']);
                  }
                  else {
                    this.eventcbIsOTPCompleted.next(false);
                    Swal.showValidationMessage('Invalid OTP');
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}
