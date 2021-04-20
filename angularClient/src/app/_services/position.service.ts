import { HttpClient } from '@angular/common/http';
import { Position } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePosition } from '../_models/position';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  addPosition(position: CreatePosition) {
    return this._http.post(`${this.baseUrl}/positions`, position);
  }
}
