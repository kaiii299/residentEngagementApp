import { Component, Input, OnInit } from '@angular/core';
import { Authservice } from '../share/services/auth.service';
import { windowService } from '../share/services/window.service';
import { userService } from '../share/services/user.service';
import Swal from 'sweetalert2';

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
  isSent: boolean = false;
  phoneNumber: string;
  verificationCode: string;

  constructor(private userService : userService,private authService: Authservice, private win: windowService) { }

  ngOnInit(): void {
    var encryptedUid = localStorage.getItem('uid');
    var uid = this.authService.decryptData(encryptedUid);
    this.userService.getUserById(uid).toPromise().then((res)=>{
      this.user = res.userData
      if (this.user.phoneNumber) {
        this.email = this.user.email;
        this.phoneNumber = this.user.phoneNumber;
      }
      else {
        this.phoneNumber = this.phoneNumber
      }
    })
  }

  async sendOTP() {
    Swal.fire({
      title: 'Enter your name',
      input: 'text',
      html: '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Your name is required'
          )
        }
      }
    })
}

  verify(){

  }

  goBack() {
    this.authService.goback()
  }
}
