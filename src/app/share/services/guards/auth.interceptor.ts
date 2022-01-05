import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Authservice } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    throw new Error("Method not implemented.");
  }
  // jwtHelper = new JwtHelperService();
  // constructor(private authService: Authservice) {}

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   if (req.url.indexOf('/refreshtoken') > -1) {
  //     return next.handle(req);
  //   }
  //   const access_token = localStorage.getItem('access_token');
  //   if (access_token) {
  //     const expiration = localStorage.getItem('expiration');
  //     if (Date.now() < Number(expiration) * 1000) {
  //       const transformedReq = req.clone({
  //         headers: req.headers.set('Authorization', `bearer ${access_token}`),
  //       });
  //       return next.handle(transformedReq);
  //     }
  //     const payload = {
  //       access_token: access_token,
  //       refresh_token: localStorage.getItem('refresh_token'),
  //     };
  //     return this.authService.callRefreshToken(payload).pipe(
  //       switchMap((newTokens: any) => {
  //         localStorage.setItem('access_token', newTokens.access_token);
  //         localStorage.setItem('refresh_token', newTokens.refresh_token);
  //         const decodedUser = this.jwtHelper.decodeToken(
  //           newTokens.access_token
  //         );
  //         localStorage.setItem('expiration', decodedUser.exp);
  //         this.authService.userInfo.next(decodedUser);
  //         const transformedReq = req.clone({
  //           headers: req.headers.set(
  //             'Authorization',
  //             `bearer ${newTokens.access_token}`
  //           ),
  //         });
  //         return next.handle(transformedReq);
  //       })
  //     );
  //   } else {
  //     return next.handle(req);
  //   }
  // }
}
