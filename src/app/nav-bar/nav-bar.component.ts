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
  userName: any;

  constructor(public authService: Authservice, public dialog: MatDialog) {
  }

 async ngOnInit() {
    var encryptedUid = localStorage.getItem("uid");
    var uid = this.authService.decryptData(encryptedUid)
   const res: any = await this.authService.getUserById(uid).subscribe(data => {
      this.user = data
      console.log(data)
    });
    var _userObj = JSON.stringify(localStorage.getItem("data"));
    this.userObj = JSON.parse(_userObj)
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
