import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Authservice } from '../auth.service';

@Injectable()
export class AuthRouteGuard {
  constructor(private authService: Authservice, private router: Router) {}

  // canActivate(next :any, state:any): Observable<boolean> {
  //   return this.authService.user$?.pipe(
  //     take(1),
  //     map((user) => !!user),
  //     tap(loggedIn =>{
  //       if(!loggedIn){
  //         console.log('access denied');
  //         this.router.navigate(['/'])
  //       }
  //     })
  //   );
  // }

  // canActivate(route: ActivatedRouteSnapshot,
  //    state: RouterStateSnapshot
  //    ):
  //    |boolean
  //    | UrlTree
  //    | Observable<boolean | UrlTree>
  //    | Promise<boolean | UrlTree> {

  //   if (state.url == "/") {
  //     return true;
  //   }
  //   const userData = this.authService.userInfo.getValue();

  //   if (userData && userData.userid) {
  //     if (state.url.indexOf("login") > -1) {
  //       this.route.navigate(['/allusers'])
  //       return false;
  //     }
  //   }
  //   else {
  //     if (state.url.indexOf("alluser") > -1) {
  //       this.route.navigate(["/"]);
  //       return false;
  //     }
  //   }
  //   return true;
  // }
}
