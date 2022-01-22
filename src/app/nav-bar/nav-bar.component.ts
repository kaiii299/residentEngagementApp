import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { map, takeWhile } from 'rxjs/operators';
import { Authservice } from '../share/services/auth.service';
import {userDataInterface} from 'src/app/share/services/Users'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  user: any;
  userObj: any;
  userArray = Array();
  displayName: any ;

  constructor(public authService: Authservice, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    var encrypted = localStorage.getItem("username")
    // console.log(encrypted);
    if(encrypted){
      this.displayName = this.authService.decryptData(encrypted)
    }
  }

  ngOnInit() {
    this.authService.eventCallbackuserName$.subscribe((data)=>{
      this.displayName = data
      var encrypted = this.authService.encryptData(this.displayName)
      localStorage.setItem("username",encrypted)
    })
  }

  userProfile(){
    const navigationExtras: NavigationExtras = {queryParams:{id: localStorage.getItem("uid")}}
    this.router.navigate(['/myprofile'],navigationExtras)
  }

  // allUsers(){
  //   const userData = this.authService.eventcbAllUserData$.subscribe
  //   const navigationExtras: NavigationExtras = {queryParams:{id: localStorage.getItem("uid")}}
  //   this.router.navigate(['/myprofile'],navigationExtras)
  // }

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
  constructor(private authService: Authservice, private dialogRef: MatDialogRef<logoutConfirmationDialog>, private router: Router) {
  }

  onNoClick() {
  }

  logout() {
    this.authService.logout();
    this.dialogRef.close()
    location.reload();
  }

}
