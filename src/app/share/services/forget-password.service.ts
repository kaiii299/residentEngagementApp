import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Constants } from 'src/app/constants';
import { Authservice } from './auth.service';
import Swal from 'sweetalert2';
import { userService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ForgetPasswordService implements OnInit {
  baseUrl = Constants.baseURL;
  email: any ;
  phoneNumber: any;
  code: any;
  valueArray = Array();
  user: any;
  test = false;
  otpSent : boolean;
  varified : boolean;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private http: HttpClient,
    private userService: userService,
    private authService: Authservice
  ) {}

  ngOnInit(): void {}

  async openForgetpassword(email_: string) {
    var encryptedUid = localStorage.getItem('uid');
    if(encryptedUid){ // logged in
      var uid = this.authService.decryptData(encryptedUid);
    await this.userService
      .getUserById(uid)
      .toPromise()
      .then((res) => {
        this.user = res.userData
        this.email = this.user.email;
      });
      if(email_){
        this.email = email_
      }
    } else{ // not logged in
        this.email = `""`
    }
    await Swal.fire({
      title: 'Reset password',
      showCancelButton: false,
      showConfirmButton: true,
      showCloseButton: true,
      reverseButtons: false,
      confirmButtonText: 'Send Email',
      showLoaderOnConfirm: true,
      html:
        `<input id="email" placeholder="Email" value=${this.email} class="swal2-input" type="email">`,
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        (this.email = document.getElementById('email')),
          (this.phoneNumber = document.getElementById('phoneNumber'));

        if (
          this.email.value == ''
        ) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> There are empty fields'
          );
        }
      },
    }).then((res) => {
      if (res.isConfirmed) {
        let _email: string = this.email.value
        this.sendResetPassWordEmail(_email).then(()=>{
          Swal.fire(`Email sent to ${_email}`,'Please check your email','success');
        }).catch((err)=>{
          Swal.fire(`Error! sending email to ${this.email.value}` ,`${err}`,'error')
        })
      }
    });
  }

  async sendResetPassWordEmail(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then((res) => {});
  }
}
