import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs/operators';
import { LoggedInUser } from '../_models/loggedInUser';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private _accountService: AccountService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let currentUser: LoggedInUser;

    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (currentUser = user));

    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }
    return next.handle(request);
  }
}
