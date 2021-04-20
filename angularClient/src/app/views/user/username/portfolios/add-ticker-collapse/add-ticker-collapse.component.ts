import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppUser } from 'src/app/_models/appUser';
import { CreatePosition, Position } from 'src/app/_models/position';
import { AppUserService } from 'src/app/_services/app-user.service';
import { PositionService } from 'src/app/_services/position.service';

@Component({
  selector: 'app-add-ticker-collapse',
  templateUrl: './add-ticker-collapse.component.html',
  styleUrls: ['./add-ticker-collapse.component.css'],
})
export class AddTickerCollapseComponent implements OnInit {
  createPositionForm: FormGroup;
  @Input() isCollapsed: boolean;
  @Output() hideCollapseEvent = new EventEmitter<boolean>();
  @Input() portfolioId: number;
  @Input() pageUser: AppUser;
  @Input() handlePortfolioData;
  @Input() getResults;
  @Input() currentTabIndex;

  constructor(
    private _fb: FormBuilder,
    private _positionService: PositionService,
    private _toastr: ToastrService // private _appUserService: AppUserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // console.log(this._appUserService.appUserCache);
  }

  initializeForm() {
    this.createPositionForm = this._fb.group({
      ticker: [
        '',
        [
          Validators.required,
          // Validators.maxLength(16),
        ],
      ],
      shares: ['', [Validators.required]],
      pricePerShare: ['', [Validators.required]],
      commissionFee: ['', []],
    });
  }

  addTicker() {
    const newPosition: CreatePosition = {
      ticker: this.createPositionForm.value.ticker,
      shares: this.createPositionForm.value.shares,
      pricePerShare: this.createPositionForm.value.pricePerShare,
      commissionFee: this.createPositionForm.value.commissionFee || null,
      portfolioId: this.portfolioId,
    };

    this._positionService
      .addPosition(newPosition)
      .subscribe((res: Position) => {
        this.hideCollapseEvent.emit(true);
        this.createPositionForm.reset();
        this.pageUser.portfolios.forEach((p) => {
          if (p.id === this.portfolioId) {
            p.positions.push(res);
          }
        });
        // these two methods are drilled from portfolios and rerender the table and pie chart.
        this.handlePortfolioData();
        this.getResults(this.currentTabIndex);
        this._toastr.success(`${res.ticker} added to portfolio.`);
      });
  }

  cancel() {
    this.hideCollapseEvent.emit(true);
    this.createPositionForm.reset();
  }
}
