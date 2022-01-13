import { Component, OnInit } from '@angular/core';
import { Authservice } from '../share/services/auth.service';
import { windowService } from '../share/services/window.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  message = '';
  email: string;
  // phoneNumber =""
  otp: string;
  verified = false;
  color = 'Green';
  user: any;

  windowRef: any;
  phoneNumber: string;
  verificationCode: string;

  constructor(private authService: Authservice, private win: windowService) { }

  ngOnInit(): void {
    //firebase.default.auth().settings.appVerificationDisabledForTesting = true
    var encryptedUid = localStorage.getItem('uid');
    var uid = this.authService.decryptData(encryptedUid);
    this.authService.getUserById(uid).then((res) => {
      res.subscribe(data => {
        this.user = data
        if (this.user.phoneNumber) {
          this.email = this.user.email;
          this.phoneNumber = this.user.phoneNumber;
          console.log("1sfad",this.phoneNumber);
        }
        else {
          this.phoneNumber = this.phoneNumber
          console.log(this.phoneNumber);
        }
      })
    });


    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('recaptcha-container', {
      size: "invisible"
    })
    //this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = "+65" + this.phoneNumber
    console.log(num);
    firebase.default
      .auth()
      .signInWithPhoneNumber(num, appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
        console.log(result)
        this.verified = true;
        console.log(this.verified);
      })
      .catch((error) => console.log(error));
  }

  verify() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((): any => {
        this.authService
          .forgetPassword(this.email)
          .then((res) => {
            this.message = 'Email sent successfully.Please check email';
            this.color = 'Green';
          })
          .catch((error) => {
            console.log(error);
            this.message = 'Failed to send email';
            this.color = "red"
          });
      }).catch(() => {
        this.message = 'Incorrect verification entered';
        this.color = "red"
      });
  }

  goBack() {
    this.authService.goback()
  }
}
