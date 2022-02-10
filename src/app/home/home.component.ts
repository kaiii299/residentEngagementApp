import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../share/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { ForgetPasswordService } from '../share/services/forget-password.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
message= " "
email: any;
password: any;
hide = true

  constructor(private forgetPasswordService: ForgetPasswordService,private authService: Authservice,private route: Router) { }

  ngOnInit(): void {
  }

   Login(){
    if(this.email == ""){
      this.message ="Please provide email"
    }

    else if(this.password == ""){
      this.message ="Please provide Password"
    }

    else{
      this.authService.signIn(this.email.trim(), this.password).then((res)=>{

     }).catch(error=>{
       this.message = "Wrong username or password"
     })
    }
  }
  openForgetPassword(){
    this.forgetPasswordService.openForgetpassword(this.email)
  }
}
