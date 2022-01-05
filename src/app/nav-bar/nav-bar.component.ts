import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { map, takeWhile } from 'rxjs/operators';
import { Authservice } from '../share/services/auth.service';
import {userDataInterface} from 'src/app/share/services/Users'

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  user: any;
  userObj: any
  userArray = Array();
  displayName: any ;

  constructor(public authService: Authservice, public dialog: MatDialog) {
    var encrypted = localStorage.getItem("username")
    // console.log(encrypted);
    if(encrypted){
      this.displayName = this.authService.decryptData(encrypted)
    }
  }

  ngOnInit() {
    this.authService.eventCallback$.subscribe(data=>{
      this.displayName = data
      var encrypted = this.authService.encryptData(this.displayName)
      localStorage.setItem("username",encrypted)
    })

  //   console.log(this.authService.currentLogedInUserId);
  //   var encryptedUid = localStorage.getItem("uid");
  //   var uid = this.authService.decryptData(encryptedUid)
  //  const res: any =  this.authService.getUserById(uid).subscribe(data => {
  //     this.user = data
  //     this.displayName = this.user.userName
  //   });
  //   var _userObj = JSON.stringify(localStorage.getItem("data"));
  //   this.userObj = JSON.parse(_userObj)
  }

  openLogoutDialog() {
    this.dialog.open(logoutConfirmationDialog, {
      width: '300px',
      height: '150px'
    })
  }
}

@Component({
  selector: 'app-nav-bar-dialog',
  templateUrl: './logout-confirmation-dialog.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class logoutConfirmationDialog {
  constructor(private authService: Authservice) {
  }

  onNoClick() {
  }

  logout() {
    this.authService.logout()
    window.location.reload()
  }

}
