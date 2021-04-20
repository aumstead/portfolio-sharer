import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio-table',
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.css'],
})
export class PortfolioTableComponent implements OnInit {
  @Input() tableData = [];
  @Input() currentTabIndex: number = 0;
  sortState: string = 'Ticker A-Z';

  constructor() {}

  ngOnInit(): void {}

  sortByAlpha() {
    this.tableData.forEach((portfolio) => {
      portfolio.sort((a, b) => {
        let comparison = 0;
        if (a.ticker > b.ticker) {
          comparison = 1;
        } else if (a.ticker < b.ticker) {
          comparison = -1;
        }
        return comparison;
      });
    });
    this.sortState = 'Ticker A-Z';
  }

  sortByPricePerShare() {
    this.tableData.forEach((portfolio) => {
      portfolio.sort((a, b) => b.pricePerShare - a.pricePerShare);
    });
    this.sortState = 'Price / Share';
  }

  sortByShares() {
    this.tableData.forEach((portfolio) => {
      portfolio.sort((a, b) => b.shares - a.shares);
    });
    this.sortState = 'Shares';
  }

  sortByCostBasis() {
    this.tableData.forEach((portfolio) => {
      portfolio.sort((a, b) => b.costBasis - a.costBasis);
    });
    this.sortState = 'Cost Basis';
  }
}
