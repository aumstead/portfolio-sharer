import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-percent-pie-modal',
  templateUrl: './percent-pie-modal.component.html',
  styleUrls: ['./percent-pie-modal.component.css'],
})
export class PercentPieModalComponent implements OnInit {
  results = [];
  showLabels: boolean;
  legendPosition: string;
  formatTooltip;
  // modalRef: BsModalRef

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.bsModalRef.setClass('modal-lg');
  }
}
