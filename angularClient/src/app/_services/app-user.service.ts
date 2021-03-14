import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_models/appUser';
import { AppUserParams } from '../_models/appUserParams';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  baseUrl = environment.apiUrl;
  appUsers: AppUser[] = [];

  constructor(private _http: HttpClient) {}

  getAppUsers(appUserParams: AppUserParams) {
    let params = this.getPaginationHeaders(
      appUserParams.pageNumber,
      appUserParams.pageSize
    );
    params = params.append('minAge', appUserParams.minAge.toString());
    params = params.append('maxAge', appUserParams.maxAge.toString());
    // probably add vehicle tags to params here when i implement this feature
    // params = params.append('vehicleTags', appUserParams.vehicleTags);

    return this.getPaginatedResult<AppUser[]>(`${this.baseUrl}/users`, params);
  }

  private getPaginatedResult<T>(url, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this._http
      .get<T>(url, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  getAppUser(username: string) {
    const appUser = this.appUsers.find((user) => user.username === username);
    if (appUser !== undefined) return of(appUser);
    return this._http.get<AppUser>(`${this.baseUrl}/users/${username}`);
  }

  updateAppUser(appUser) {
    return this._http.put(`${this.baseUrl}/users`, appUser).pipe(
      map(() => {
        const index = this.appUsers.indexOf(appUser);
        this.appUsers[index] = appUser;
        console.log(this.appUsers[index]);
      })
    );
  }
}
