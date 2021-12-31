import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Authservice } from '../share/services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  users: any;
  userArray = Array();
  displayName: string;
  logedIn: boolean ;

  constructor(private authService: Authservice) {
    if(localStorage.getItem("userId") == "0" || !localStorage.getItem("userId")){
      this.logedIn = false
    }
    else{
      this.logedIn = true
    }
  }

  ngOnInit(): void {
    this.users = this.authService.getSignInUser().subscribe(res=>{
      this.userArray.push(res)
      console.log(this.userArray)
    });
  }

  logout() {
    this.authService.logout()
    window.location.reload()
  }



}
