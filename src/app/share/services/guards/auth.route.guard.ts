import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { confirmationDialog } from '../../confirmatonDialog';
import { Authservice } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class AuthRouteGuard implements CanActivate {

  jwt: any;
  lcjwt = localStorage.getItem('token');
  refreshToken: any;
  lcRefreshToken: any = localStorage.getItem('refreshToken');

  constructor(private authService: Authservice, private router: Router,private dialog: MatDialog) {}

  canActivate(next :ActivatedRouteSnapshot, state:any): Observable<boolean> | Promise<boolean> | boolean {
    const permission = next.data["permission"];

    this.authService.eventcbJWT$.subscribe(jwt => this.jwt = jwt );

    this.authService.eventcbRefresh$.subscribe(refresh => this.refreshToken = refresh)

    // console.log(JSON.parse(this.lcRefreshToken));
    // console.log(this.refreshToken);

    // const decryptedjwt = this.authService.decryptData(this.lcjwt);
    // console.log(decryptedjwt);
    // console.log("jwt "+ this.jwt);

    if(this.jwt == undefined || !this.jwt){
      this.jwt = this.lcjwt;
    }
    if(this.refreshToken == undefined || !this.refreshToken){
      this.refreshToken = this.lcRefreshToken;
    }

    if(this.jwt && this.refreshToken){
      return true;
    }
    else{
      localStorage.clear();
      Swal.fire(
        'please log in','', 'error'
        )
    }
    this.router.navigate(['/'])
    return false;
  }

}
