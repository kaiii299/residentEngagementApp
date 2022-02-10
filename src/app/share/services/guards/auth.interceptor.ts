import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";
import Swal from "sweetalert2";
import { SpinnerService } from "../../spinner.service";
import { Authservice } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwt: any;
  role: any;
  constructor(private injector: Injector, private spinnerService: SpinnerService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const authservice = this.injector.get(Authservice);
    const _jwt = localStorage.getItem('token');
    const _role = localStorage.getItem('role');
    const refreshToken = localStorage.getItem('refreshToken');
    this.jwt = authservice.decryptData(_jwt);
    if(_role){
    this.role = authservice.decryptData(_role);
    }
    const tokenizeReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this.jwt}`,
        role:`${this.role}`
      }
    })

    this.spinnerService.requestStarted();
    return next.handle(tokenizeReq).pipe(
      catchError((error: HttpErrorResponse)=>{
        if(error.status == 401){
          this.spinnerService.requestEnded();
          Swal.fire('Error','User unthorized','error');
        } else if (error.status == 403){
          Swal.fire('Error','Token expired. Please log in again','error');
          this.router.navigate(['/']);
        }
        else{
          Swal.fire('Error',`${error.message}`,'error');
        }
        this.spinnerService.requestEnded();
        return throwError(error);
      }),
      finalize(()=>{
        this.spinnerService.requestEnded();
      })
    )
  }
}
