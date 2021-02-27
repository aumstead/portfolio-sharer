import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_models/appUser';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  baseUrl = environment.apiUrl;
  appUsers: AppUser[] = [];
  constructor(private _http: HttpClient) {}

  getAppUsers() {
    if (this.appUsers.length > 0) return of(this.appUsers);
    return this._http.get<AppUser[]>(`${this.baseUrl}/users`).pipe(
      map((users) => {
        this.appUsers = users;
        return users;
      })
    );
  }

  getAppUser(username: string) {
    const appUser = this.appUsers.find((user) => user.username === username);
    if (appUser !== undefined) return of(appUser);
    return this._http.get<AppUser>(`${this.baseUrl}/users/${username}`);
  }

  updateAppUser(appUser: AppUser) {
    return this._http.put(`${this.baseUrl}/users`, appUser).pipe(
      map(() => {
        const index = this.appUsers.indexOf(appUser);
        this.appUsers[index] = appUser;
      })
    );
  }
}
