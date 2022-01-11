import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { confirmationDialog } from '../../confirmatonDialog';
import { Authservice } from '../auth.service';

@Injectable()
export class AuthRouteGuard implements CanActivate {
  constructor(private authService: Authservice, private router: Router,private dialog: MatDialog) {}

  canActivate(next :ActivatedRouteSnapshot, state:any): Observable<boolean> | Promise<boolean> | boolean {
    const permission = next.data["permission"];
    if(localStorage.getItem("uid")){
      return true;
    }
    else{
      this.dialog.open(confirmationDialog,{
        data:{
          message: "Please Login"
        }
      })
    }
    this.router.navigate(["/"])
    return false;
  }

}
