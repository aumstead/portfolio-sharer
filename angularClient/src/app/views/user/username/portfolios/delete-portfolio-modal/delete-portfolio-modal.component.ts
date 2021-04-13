import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from 'src/app/_services/portfolio.service';

@Component({
  selector: 'app-delete-portfolio-modal',
  templateUrl: './delete-portfolio-modal.component.html',
  styleUrls: ['./delete-portfolio-modal.component.css'],
})
export class DeletePortfolioModalComponent implements OnInit {
  id: number;
  name: string;
  // pageUser;
  loadUser;

  constructor(
    public bsModalRef: BsModalRef,
    private _portfolioService: PortfolioService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  deletePortfolio(id: number) {
    this._portfolioService.deletePortfolio(id).subscribe(() => {
      this._toastrService.success('Portfolio deleted.');

      this.loadUser();

      this.bsModalRef.hide();
    });
  }
}
