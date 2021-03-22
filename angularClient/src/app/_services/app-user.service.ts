import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_models/appUser';
import { AppUserParams } from '../_models/appUserParams';
import { PaginatedResult } from '../_models/pagination';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  baseUrl = environment.apiUrl;
  appUsers: AppUser[] = [];
  appUserCache = new Map();
  appUserParams: AppUserParams = new AppUserParams();

  constructor(
    private _http: HttpClient,
    private _accountService: AccountService
  ) {}

  getAppUserParams() {
    return this.appUserParams;
  }

  setAppUserParams(params: AppUserParams) {
    this.appUserParams = params;
  }

  resetAppUserParams() {
    this.appUserParams = new AppUserParams();
    return this.appUserParams;
  }

  getAppUsers(appUserParams: AppUserParams) {
    const response = this.appUserCache.get(
      Object.values(appUserParams).join('-')
    );
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(
      appUserParams.pageNumber,
      appUserParams.pageSize
    );
    params = params.append('minAge', appUserParams.minAge.toString());
    params = params.append('maxAge', appUserParams.maxAge.toString());
    params = params.append('orderBy', appUserParams.orderBy);
    params = params.append('following', appUserParams.following.toString());
    // probably add vehicle tags to params here when i implement this feature
    // params = params.append('vehicleTags', appUserParams.vehicleTags);

    return getPaginatedResult<AppUser[]>(
      `${this.baseUrl}/users`,
      params,
      this._http
    ).pipe(
      map((response) => {
        this.appUserCache.set(Object.values(appUserParams).join('-'), response);
        return response;
      })
    );
  }

  getAppUser(username: string) {
    let appUser = [...this.appUserCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((appUser: AppUser) => appUser.username === username);
    if (appUser) return of(appUser);

    return this._http.get<AppUser>(`${this.baseUrl}/users/${username}`);
  }

  updateAppUser(appUser) {
    return this._http.put(`${this.baseUrl}/users`, appUser).pipe(
      map(() => {
        const index = this.appUsers.indexOf(appUser);
        this.appUsers[index] = appUser;
      })
    );
  }
}
