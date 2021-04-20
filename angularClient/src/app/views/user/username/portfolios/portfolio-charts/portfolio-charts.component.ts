import { Component, Input, OnInit } from '@angular/core';
import { PercentPieModalComponent } from '../percent-pie-modal/percent-pie-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-portfolio-charts',
  templateUrl: './portfolio-charts.component.html',
  styleUrls: ['./portfolio-charts.component.css'],
})
export class PortfolioChartsComponent implements OnInit {
  bsModalRef: BsModalRef;
  @Input() results;

  constructor(private _modalService: BsModalService) {}

  ngOnInit(): void {}

  formatTooltip(obj) {
    return `${obj.value}%`;
  }

  openPercentPieModal() {
    this.bsModalRef = this._modalService.show(PercentPieModalComponent);
    this.bsModalRef.content.results = this.results;
    this.bsModalRef.content.formatTooltip = this.formatTooltip;
  }
}
