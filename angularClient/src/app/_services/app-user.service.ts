import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_models/appUser';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  getAppUsers() {
    return this._http.get<AppUser[]>(`${this.baseUrl}/users`);
  }

  getAppUser(username: string) {
    return this._http.get<AppUser>(`${this.baseUrl}/users/${username}`);
  }
}
