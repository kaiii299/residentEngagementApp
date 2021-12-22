import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  checkEmpty(){
    if(this.email ==""){
      this.message == "Please provide email"
    }
    if(this.phoneNumber ==""){
      this.message=="Please provide phone number"
    }
    if(this.otp ==""){
      this.message =="Please provide OTP"
    }
  }

}
