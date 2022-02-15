import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { map, takeWhile } from 'rxjs/operators';
import { Authservice } from '../share/services/auth.service';
import { userDataInterface } from 'src/app/share/services/Users';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { userService } from '../share/services/user.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  user: any;
  userObj: any;
  userArray = Array();
  displayName: any;
  role: any;
  hidden = false;
  pendingNumber: any;
  constructor(
    public userService: userService,
    public authService: Authservice,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const encrypted = localStorage.getItem('username');
    // console.log(encrypted);
    if (encrypted) {
      this.displayName = this.authService.decryptData(encrypted);
    }
  }

  ngOnInit() {
    this.authService.eventCallbackuserName$.subscribe((userName) => {
      this.displayName = userName;
      const encrypted = this.authService.encryptData(this.displayName);
      localStorage.setItem('username', encrypted);

    });

    this.authService.eventcbRole$.subscribe((role) => {
      this.role = role;
    });
    if (!this.role || this.role == undefined) {
      const _role = localStorage.getItem('role');
      if (_role){
        this.role = this.authService.decryptData(_role);
      }
    }
    this.checkPending();
  }

  checkPending(){
    this.userService.checkPendingUsers().subscribe((res) => {
      if (res.length !== 0){
        this.pendingNumber = res.length;
      }
      else{
        this.hidden = true;
      }
    });
  }

  userProfile() {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: localStorage.getItem('uid') },
    };
    this.router.navigate(['/userprofile'], navigationExtras);
    setTimeout(() => {
      location.reload();
    }, 200);
  }

  openLogoutDialog() {
    Swal.fire({
      title: 'Log out',
      showCancelButton: true,
      confirmButtonText: 'Log out',
      confirmButtonColor: '#3d53ad',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        localStorage.clear();
        location.reload();
      }
    });
  }
}
