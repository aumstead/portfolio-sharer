import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';

@Component({
  selector: 'app-overview-portfolio',
  templateUrl: './overview-portfolio.component.html',
  styleUrls: ['./overview-portfolio.component.css'],
})
export class OverviewPortfolioComponent implements OnInit {
  @Input() portfolioTotalValues;
  @Input() pageUser: AppUser;
  @Input() portfolioObjArr;
  @Output() selectedPortfolioIndex = new EventEmitter<number>();
  totalSumOfPortfolios: number;
  // charts
  breakdownResults = [];
  totalPositions = 0;

  constructor() {}

  ngOnInit(): void {
    this.setTotalSumOfPortfolios();
    this.setBreakdownResults();
    this.loopPortfolioObjArr();
  }

  setTotalSumOfPortfolios() {
    let sum = 0;
    this.portfolioTotalValues.forEach((portfolio) => {
      sum += portfolio.value;
    });
    this.totalSumOfPortfolios = sum;
  }

  selectPortfolio(index: number) {
    this.selectedPortfolioIndex.emit(index);
  }

  formatTooltip(obj) {
    return `${obj.value}%`;
  }

  setBreakdownResults() {
    this.portfolioTotalValues.forEach((portfolioObj) => {
      let resultObj = {};
      let value = (
        (portfolioObj.value / this.totalSumOfPortfolios) *
        100
      ).toFixed(1);
      if (value === 'Infinity') {
        resultObj = {
          name: portfolioObj.name,
          value: 0,
        };
      } else {
        resultObj = {
          name: portfolioObj.name,
          value: value,
        };
      }
      this.breakdownResults.push(resultObj);
    });
  }

  loopPortfolioObjArr() {
    let positionsTotal = 0;
    this.portfolioObjArr.forEach((portfolioObj) => {
      positionsTotal += portfolioObj.positions.length;
    });
    this.totalPositions = positionsTotal;
  }
}
