import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Authservice } from '../auth.service';

@Injectable()
export class HasRoleGuard implements CanActivate {
  role: any;
  constructor(private authService: Authservice, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: any
  ): Observable<boolean> | Promise<boolean> | boolean {
    const permission = next.data.permission;

    const _role = localStorage.getItem('role');
    this.role = this.authService.decryptData(_role);

    if (this.role == 'Admin') {
      return true;
    }
    Swal.fire('Error', 'Unthorized Access', 'error').then((res) => {
      if (res.isConfirmed){
        this.authService.goback();
      }else{
        this.authService.goback();
      }
    });
    return false;
  }
}
