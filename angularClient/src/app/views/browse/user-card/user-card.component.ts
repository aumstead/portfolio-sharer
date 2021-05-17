import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from 'src/app/_models/appUser';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
})
export class UserCardComponent implements OnInit {
  @Input() appUser: AppUser;
  portfolioTotalValues = [];
  totalAmountInvested = 0;
  constructor() {}

  ngOnInit(): void {
    this.calculatePortfolioTotals();
    this.calculateTotalAmountInvested();
  }

  calculatePortfolioTotals() {
    this.portfolioTotalValues = [];
    this.appUser.portfolios.forEach((portfolio) => {
      let portfolioObj = {
        name: portfolio.name,
        value: 0,
      };

      let portfolioTotal = 0;
      portfolio.positions.forEach((p) => {
        portfolioTotal += p.costBasis;
      });

      portfolioObj.value = portfolioTotal;

      this.portfolioTotalValues.push(portfolioObj);
    });
  }

  calculateTotalAmountInvested() {
    this.portfolioTotalValues.forEach((portfolioObj) => {
      this.totalAmountInvested += portfolioObj.value;
    });
  }
}
