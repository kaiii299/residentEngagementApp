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
      this.authService.signIn(this.loginData.email, this.loginData.password).then((res)=>{
        
     }).catch(error=>{
       this.message = "Wrong username or password"
     })
    }

  }

}
