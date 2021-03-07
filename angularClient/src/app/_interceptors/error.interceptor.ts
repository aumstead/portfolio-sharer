import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              console.log('400 error. Error:', error);
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              } else if (error.error.type === 'email') {
                const errorArr = [];
                errorArr.push(error.error.message);
                throw errorArr;
              } else if (error.error.type === 'username') {
                const errorArr = [];
                errorArr.push(error.error.message);
                throw errorArr;
              } else if (typeof error.error === 'object') {
                this._toastr.error(error.statusText, error.status);
              } else {
                this._toastr.error(error.error, error.status);
              }
              break;

            case 401:
              if (error.error?.source === 'login') {
                // handle error in login component
                break;
              } else {
                this._toastr.error('Unauthorized', error.status);
              }
              break;

            case 404:
              this._router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this._router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this._toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }
}
