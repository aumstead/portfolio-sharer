import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/_models/appUser';
import { Portfolio } from 'src/app/_models/portfolio';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';
import { PortfolioService } from 'src/app/_services/portfolio.service';

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
  data = [];
  results = [];
  tableData = [];
  isCollapsed = true;

  // create portfolio form
  newPortfolio: any = {};
  @ViewChild('createPortfolioForm') createPortfolioForm: NgForm;

  // pie chart
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  showLegend: boolean = true;
  showLabels: boolean = true;
  legendPosition: string = 'right';

  constructor(
    private _appUserService: AppUserService,
    private _route: ActivatedRoute,
    private _accountService: AccountService,
    private _portfolioService: PortfolioService,
    private _router: Router
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
    this.currentPortfolioId = this.data[index]?.id;
    this.currentPortfolioName = this.data[index]?.name;
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
      this.currentPortfolioId = this.data[index]?.id;
      this.currentPortfolioName = this.data[index]?.name;
    }
  }

  organizeTabs() {
    this.tabs[0].active = true;
  }

  createTabs() {
    this.pageUser.portfolios.forEach((portfolio) => {
      let tab = {
        title: portfolio.name,
      };
      this.tabs.push(tab);
    });
    if (this.isPageUserLoggedInUser) {
      this.tabs.push({ title: 'Add portfolio +' });
    }
    if (this.tabs.length === 0) {
      this.tabs.push({ title: 'Empty' });
    }
  }

  getResults(index) {
    this.results = this.data[index]?.positions;
  }

  handlePortfolioData() {
    this.data = [];
    this.tableData = [];
    this.pageUser.portfolios.forEach((portfolio) => {
      let portfolioObj = {
        name: portfolio.name,
        positions: [],
        id: portfolio.id,
      };

      let tablePortfolio = [];

      portfolio.positions.forEach((p) => {
        let position = {
          name: p.ticker,
          value: parseFloat(
            (p.shares * (p.pricePerShare + p.commissionFee)).toFixed(2)
          ),
        };

        let tablePosition = {
          ticker: p.ticker,
          shares: p.shares,
          pricePerShare: p.pricePerShare,
          commissionFee: p.commissionFee,
        };

        portfolioObj.positions.push(position);
        tablePortfolio.push(tablePosition);
      });

      this.data.push(portfolioObj);
      this.tableData.push(tablePortfolio);
    });
  }

  createPortfolio() {
    this._portfolioService
      .createPortfolio(this.newPortfolio.name)
      .subscribe((newPortfolio) => {
        console.log('in subscribe', newPortfolio);
        // this._router.navigateByUrl(`user/${this.pageUser.username}/portfolios`);
        this.createPortfolioForm.reset();
        this.loadUser();
      });
  }
}
