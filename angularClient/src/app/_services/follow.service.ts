import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  baseUrl = environment.apiUrl;
  followingCache = [];

  constructor(private _http: HttpClient) {}

  addFollow(username: string) {
    return this._http.post(`${this.baseUrl}/follows/${username}`, {});
  }

  getFollows(predicate: string) {
    if (predicate === 'following') {
      if (this.followingCache.length > 0) {
        return of(this.followingCache);
      }
      return this._http
        .get(`${this.baseUrl}/follows?predicate=${predicate}`)
        .pipe(
          map((response) => {
            for (const property in response) {
              this.followingCache.push(response[property].username);
            }
            return this.followingCache;
          })
        );
    } else {
      return this._http.get(`${this.baseUrl}/follows?predicate=${predicate}`);
    }
  }

  removeFollow(pageUserId: number) {
    return this._http.delete(`${this.baseUrl}/follows/${pageUserId}`);
  }
}
