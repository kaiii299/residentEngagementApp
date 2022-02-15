import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../share/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { ForgetPasswordService } from '../share/services/forget-password.service';
import Swal from 'sweetalert2';
import { title } from 'process';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
message = ' ';
email: any;
password: any;
hide = true;
  constructor(private forgetPasswordService: ForgetPasswordService, private authService: Authservice, private route: Router) { }

  ngOnInit(): void {
  }

   Login(){
    if (this.email == ''){
      Swal.fire("Error","Please provide email","error")
    }

    else if (this.password == ''){
     Swal.fire("Error","Please provide password","error")
    }

    else{
      this.authService.signIn(this.email.trim(), this.password).then((res) => {

     }).catch(error => {
       Swal.fire({
         title:"Wrong email or passoword",
         icon:'error',
         showDenyButton: true,
         denyButtonText:"Forget password?",
         denyButtonColor: "#505050"
       }).then((res)=>{
         if(res.isDenied){
           this.openForgetPassword();
         }
       })
     });
    }
  }
  openForgetPassword(){
    this.forgetPasswordService.openForgetpassword(this.email);
  }
}
