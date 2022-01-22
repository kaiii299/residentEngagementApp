import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Authservice } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwt: any
  constructor(private injector: Injector){}

  intercept(req: any, next: any){
    const authservice = this.injector.get(Authservice);
    const _jwt = localStorage.getItem('token')
    this.jwt = authservice.decryptData(_jwt)
    const tokenizeReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this.jwt}`
      }
    })
    return next.handle(tokenizeReq)
  }
}
