import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
import { Portfolio } from 'src/app/_models/portfolio';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';
import { PortfolioService } from 'src/app/_services/portfolio.service';
import { PercentPieModalComponent } from './percent-pie-modal/percent-pie-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css'],
})
export class PortfoliosComponent implements OnInit {
  pageUser: AppUser;
  loggedInUser;
  isPageUserLoggedInUser = false;
  currentTabIndex: number = 0;
  currentPortfolioId: number;
  currentPortfolioName: string;
  tabs: any[] = [];
  // a collection of portfolioObjects which contain details about each portfolio. Used to get currentPortfolioId and currentPortfolioName
  portfolioObjArr = [];
  portfolioTotalValues = [];
  // results is for pie chart data
  results = [];
  tableData = [];
  bsModalRef: BsModalRef;

  constructor(
    private _appUserService: AppUserService,
    private _route: ActivatedRoute,
    private _accountService: AccountService,
    private _router: Router,
    private _modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getLoggedInUser();
    this._route.paramMap.subscribe((params) => {
      this.loadUser();
    });
  }

  loadUser() {
    this._appUserService
      .getAppUser(this._route.snapshot.paramMap.get('username'))
      .subscribe((user) => {
        this.pageUser = user;
        // tabs methods. table data is handled in handlePortfolioData()
        // reset tabs for when different user is displayed
        this.tabs = [];
        if (this.pageUser.username === this.loggedInUser.username) {
          this.isPageUserLoggedInUser = true;
        }
        this.createTabs();
        this.organizeTabs();
        this.handlePortfolioData();
        this.getResults(0);
        this.initCurrentPortfolioId(0);
        // for reloading after deleting portfolio
        this.currentTabIndex = 0;
      });
  }

  initCurrentPortfolioId(index: number) {
    this.currentPortfolioId = this.portfolioObjArr[index - 1]?.id;
    this.currentPortfolioName = this.portfolioObjArr[index - 1]?.name;
  }

  getLoggedInUser() {
    this._accountService.currentUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  onSelect(index: number) {
    // if tab selected is add portfolio, ie the last index in tabs array
    if (this.isPageUserLoggedInUser && index === this.tabs.length - 1) {
      this.currentTabIndex = -1;
      this.currentPortfolioId = -1;
    } else {
      this.getResults(index);
      this.currentTabIndex = index;
      this.currentPortfolioId = this.portfolioObjArr[index - 1]?.id;
      this.currentPortfolioName = this.portfolioObjArr[index - 1]?.name;
    }
  }

  organizeTabs() {
    this.tabs[0].active = true;
  }

  createTabs() {
    let overviewTab = {
      title: 'Overview',
    };
    this.tabs.push(overviewTab);
    this.pageUser.portfolios.forEach((portfolio) => {
      let tab = {
        title: portfolio.name,
      };
      this.tabs.push(tab);
    });
    if (this.isPageUserLoggedInUser) {
      this.tabs.push({ title: 'Add portfolio +' });
    }
    // if (this.tabs.length === 0) {
    //   this.tabs.push({ title: 'Empty' });
    // }
  }

  // this method is for pie chart. gets drilled down into add-ticker-collapse in order to rerender after adding position
  getResults(index) {
    // subtract 1 from index to account for overview tab
    this.results = this.portfolioObjArr[index - 1]?.positions;
  }

  calculatePortfolioTotals() {
    this.portfolioTotalValues = [];
    this.pageUser.portfolios.forEach((portfolio) => {
      let portfolioTotal = 0;
      portfolio.positions.forEach((p) => {
        portfolioTotal += p.costBasis;
      });

      this.portfolioTotalValues.push(portfolioTotal);
    });
  }

  // this method gets drilled into add-ticker-collapse just like getResults in order to rerender table.
  handlePortfolioData() {
    this.calculatePortfolioTotals();
    this.portfolioObjArr = [];
    this.tableData = [];
    this.pageUser.portfolios.forEach((portfolio, i) => {
      let portfolioObj = {
        name: portfolio.name,
        positions: [],
        id: portfolio.id,
      };

      // portfolio gets pushed to table data and displayed there
      let tablePortfolio = [];

      portfolio.positions.forEach((p) => {
        let percentOfPortfolio = (
          (p.costBasis / this.portfolioTotalValues[i]) *
          100
        ).toFixed(1);

        // position for pie chart
        let position = {
          name: p.ticker,
          value: percentOfPortfolio,
        };

        // position for table
        let tablePosition = {
          ticker: p.ticker,
          shares: p.shares,
          pricePerShare: p.pricePerShare,
          costBasis: p.costBasis,
          commissionFee: p.commissionFee,
          percentOfPortfolio: percentOfPortfolio,
        };

        portfolioObj.positions.push(position);
        tablePortfolio.push(tablePosition);
      });

      // push portfolios to respective arrays
      // sort for pie chart by cost basis
      portfolioObj.positions.sort((a, b) => b.value - a.value);
      this.portfolioObjArr.push(portfolioObj);
      // sort portfolio alphabetically
      tablePortfolio.sort((a, b) => {
        let comparison = 0;
        if (a.ticker > b.ticker) {
          comparison = 1;
        } else if (a.ticker < b.ticker) {
          comparison = -1;
        }
        return comparison;
      });
      this.tableData.push(tablePortfolio);
    });
  }

  goToAddPortfolio() {
    let addPortfolioIndex = this.tabs.length - 1;
    // this.onSelect(addPortfolioIndex);
    this.tabs[addPortfolioIndex].active = true;
  }
}
