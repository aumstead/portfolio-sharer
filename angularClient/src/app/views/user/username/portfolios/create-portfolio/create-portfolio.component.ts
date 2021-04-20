import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Portfolio } from 'src/app/_models/portfolio';
import { PortfolioService } from 'src/app/_services/portfolio.service';

@Component({
  selector: 'app-create-portfolio',
  templateUrl: './create-portfolio.component.html',
  styleUrls: ['./create-portfolio.component.css'],
})
export class CreatePortfolioComponent implements OnInit {
  newPortfolio: any = {};
  @ViewChild('createPortfolioForm') createPortfolioForm: NgForm;
  @Input() loadUser;

  constructor(private _portfolioService: PortfolioService) {}

  ngOnInit(): void {}

  createPortfolio() {
    this._portfolioService
      .createPortfolio(this.newPortfolio.name)
      .subscribe((newPortfolio: Portfolio) => {
        // this._router.navigateByUrl(`user/${this.pageUser.username}/portfolios`);
        this.createPortfolioForm.reset();
        this.loadUser();
        // this.pageUser.portfolios.push(newPortfolio);
        // console.log(this.pageUser.portfolios);
      });
  }
}
