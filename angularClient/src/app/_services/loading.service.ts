import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingRequestCount = 0;

  constructor(private _spinnerService: NgxSpinnerService) {}

  loading() {
    this.loadingRequestCount++;
    this._spinnerService.show(undefined, {
      type: 'line-scale-pulse-out',
      bdColor: 'rgba(256,256,256,0)',
      color: '#c24c4c',
      size: 'default',
    });
  }

  idle() {
    this.loadingRequestCount--;
    console.log('in idle, count:', this.loadingRequestCount);
    if (this.loadingRequestCount <= 0) {
      this.loadingRequestCount = 0;
      this._spinnerService.hide();
    }
  }
}
