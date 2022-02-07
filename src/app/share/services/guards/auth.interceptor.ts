import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { finalize, switchMap } from "rxjs/operators";
import { SpinnerService } from "../../spinner.service";
import { Authservice } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwt: any
  constructor(private injector: Injector, private spinnerService: SpinnerService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const authservice = this.injector.get(Authservice);
    const _jwt = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    this.jwt = authservice.decryptData(_jwt)

    const tokenizeReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this.jwt}`
      }
    })

    this.spinnerService.requestStarted();
    return next.handle(tokenizeReq).pipe(
      finalize(()=>{
        this.spinnerService.requestEnded();
      })
    )
  }
}
