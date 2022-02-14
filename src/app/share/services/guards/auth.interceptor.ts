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
  constructor(private injector: Injector, private authService: Authservice, private spinnerService: SpinnerService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authservice = this.injector.get(Authservice);
    const _jwt = localStorage.getItem('token');
    const _role = localStorage.getItem('role');
    const refreshToken = localStorage.getItem('refreshToken');
    if (_role) {
      this.role = authservice.decryptData(_role);
    }
    this.authService.eventcbRole$.subscribe((role) => {
      this.role = role
    })

    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${_jwt}`,
        role: `${this.role}`,
      }
    })

    this.spinnerService.requestStarted();
    return next.handle(tokenizeReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.spinnerService.requestEnded();
          Swal.fire('Error', 'User unthorized', 'error');
        } else if (error.status == 403) {
          Swal.fire('Error', 'Token expired. Please log in again', 'error').then((res) => {
            if (res.isConfirmed) {
              this.router.navigate(['/']);
              localStorage.clear();
              location.reload();
            }
          });
        }
        else {
          Swal.fire('Error', `${error.message}`, 'error').then((res) => {
            if (res.isConfirmed) {
              this.authService.goback();
            }
          });
        }
        this.spinnerService.requestEnded();
        return throwError(error);
      }),
      finalize(() => {
        this.spinnerService.requestEnded();
      })
    )
  }
}
