import { Component, OnInit } from '@angular/core';
import { Authservice } from '../share/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
message=""
email=""
phoneNumber =""
otp =''
verify = false
color ="Green"

  constructor(private authService: Authservice) { }

  ngOnInit(): void {
  }

  forgetPasswordsendEmail(email: string, phoneNumber: string, otp: string){
    email = this.email;
    phoneNumber = this.phoneNumber;
    otp = this.otp;

    if(!this.email){
      this.message == "Please provide email"
      this.color = "red"
    }
    if(!this.phoneNumber){
      this.message=="Please provide phone number"
      this.color = "red"
    }
    if(!this.otp){
      this.message =="Please provide OTP"
      this.color = "red"
    }
    else if(this.email, this.phoneNumber, this.otp){
      this.authService.forgetPassword(this.email).then(res=>{
        this.message = "Email sent successfully.Please check email"
        this.color = "Green"
      })
    }
  }

}
