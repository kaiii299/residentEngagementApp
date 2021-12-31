import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, } from "@angular/router";
import { Observable } from "rxjs";
import { Authservice } from "../auth.service";

@Injectable()
export class AuthRouteGuard implements CanActivate {

  constructor(private authService: Authservice, private route: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot
     ):
     |boolean
     | UrlTree
     | Observable<boolean | UrlTree>
     | Promise<boolean | UrlTree> {

    if (state.url == "/") {
      return true;
    }
    const userData = this.authService.userInfo.getValue();

    if (userData && userData.userid) {
      if (state.url.indexOf("login") > -1) {
        this.route.navigate(['/allusers'])
        return false;
      }
    }
    else {
      if (state.url.indexOf("alluser") > -1) {
        this.route.navigate(["/"]);
        return false;
      }
    }
    return true;
  }


}
