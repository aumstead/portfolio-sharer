import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUserService } from './app-user.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  baseUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private _appUserService: AppUserService
  ) {}

  updatePortfolioName(id, updatedName) {
    return this._http.put(
      `${this.baseUrl}/portfolios?id=${id}&updatedName=${updatedName}`,
      {}
    );
  }

  createPortfolio(name: string) {
    return this._http.post(
      `${this.baseUrl}/portfolios?portfolioName=${name}`,
      {}
    );
  }

  deletePortfolio(id: number) {
    return this._http.delete(`${this.baseUrl}/portfolios/${id}`);
  }
}
