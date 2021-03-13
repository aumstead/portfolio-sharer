import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_models/appUser';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  baseUrl = environment.apiUrl;
  appUsers: AppUser[] = [];
  paginatedResult: PaginatedResult<AppUser[]> = new PaginatedResult<
    AppUser[]
  >();

  constructor(private _http: HttpClient) {}

  getAppUsers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this._http
      .get<AppUser[]>(`${this.baseUrl}/users`, { observe: 'response', params })
      .pipe(
        map((response) => {
          this.paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            this.paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return this.paginatedResult;
        })
      );
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
