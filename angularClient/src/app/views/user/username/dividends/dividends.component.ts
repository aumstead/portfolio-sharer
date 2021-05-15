import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/_models/appUser';
import { AccountService } from 'src/app/_services/account.service';
import { AppUserService } from 'src/app/_services/app-user.service';

@Component({
  selector: 'app-dividends',
  templateUrl: './dividends.component.html',
  styleUrls: ['./dividends.component.css'],
})
export class DividendsComponent implements OnInit {
  pageUser: AppUser;
  loggedInUser;
  isPageUserLoggedInUser = false;
  tabs: any[] = [];
  currentTabIndex: number = 0;

  constructor(
    private _appUserService: AppUserService,
    private _route: ActivatedRoute,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getLoggedInUser();
    this._route.paramMap.subscribe((params) => {
      this.loadUser();
    });
  }

  onSelect(index: number) {
    // if tab selected is add portfolio, ie the last index in tabs array
    // if (this.isPageUserLoggedInUser && index === this.tabs.length - 1) {
    //   this.currentTabIndex = -1;
    //   this.currentPortfolioId = -1;
    // } else {
    //   this.getResults(index);
    //   this.currentTabIndex = index;
    //   this.currentPortfolioId = this.portfolioObjArr[index - 1]?.id;
    //   this.currentPortfolioName = this.portfolioObjArr[index - 1]?.name;
    // }
  }

  loadUser() {
    this._appUserService
      .getAppUserPositions(this._route.snapshot.paramMap.get('username'))
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
        // this.handlePortfolioData();
        // this.getResults(0);
        // this.initCurrentPortfolioId(0);
        // for reloading after deleting portfolio
        this.currentTabIndex = 0;
      });
  }

  organizeTabs() {
    this.tabs[0].active = true;
  }

  createTabs() {
    let overviewTab = {
      title: 'Overview',
    };

    this.tabs.push(overviewTab);
    // this.staticTabs.tabs.push(overviewTab);
    this.pageUser.portfolios.forEach((portfolio) => {
      let tab = {
        title: portfolio.name,
      };
      this.tabs.push(tab);
    });
    if (this.isPageUserLoggedInUser) {
      this.tabs.push({ title: 'Add dividend +' });
    }
    // if (this.tabs.length === 0) {
    //   this.tabs.push({ title: 'Empty' });
    // }
  }

  getLoggedInUser() {
    this._accountService.currentUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
  }
}
