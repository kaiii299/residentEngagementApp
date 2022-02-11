import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
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

  constructor(
    private authService: Authservice,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: any
  ): Observable<boolean> | Promise<boolean> | boolean {
    const permission = next.data['permission'];

    this.authService.eventcbJWT$.subscribe((jwt) => (this.jwt = jwt));

    this.authService.eventcbRefresh$.subscribe(
      (refresh) => (this.refreshToken = refresh)
    );

    if (this.jwt == undefined || !this.jwt) {
      this.jwt = this.lcjwt;
    }else{
      this.jwt = this.jwt
    }
    if (this.refreshToken == undefined || !this.refreshToken) {
      this.refreshToken = this.lcRefreshToken;
    }else{
      this.refreshToken = this.refreshToken
    }

    if (this.jwt && this.refreshToken) {
      return true;
    }else{
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
