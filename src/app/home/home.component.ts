import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../share/services/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
message= " "
hide = true
  constructor(private authService: Authservice,private route: Router) { }
  loginData ={
    email:'',
    password: ''
  }

  ngOnInit(): void {
  }


   Login(){
    if(this.loginData.email == ""){
      this.message ="Please provide email"
    }

    else if(this.loginData.password == ""){
      this.message ="Please provide Password"
    }

    else{
      this.authService.signIn(this.loginData.email, this.loginData.password).then(userInfo=>{
       var userObj: any = userInfo;
       var uid = userObj.user.uid;
       const encryptedText = this.authService.encryptData(uid)
       localStorage.setItem("uid",encryptedText);
        var _uid = this.authService.decryptData(encryptedText)
        this.authService.getUserById(_uid).subscribe(res=>{
        localStorage.setItem('data', JSON.stringify(res).replace("'\"",' '))
      })
       this.route.navigate(['allusers']);
     }).catch(error=>{
       this.message = "Wrong password"
     })
    }

  }

}
