import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AppUser } from 'src/app/_models/appUser';
import { AppUserService } from 'src/app/_services/app-user.service';
import { PortfolioService } from 'src/app/_services/portfolio.service';

@Component({
  selector: 'app-edit-name-modal',
  templateUrl: './edit-name-modal.component.html',
  styleUrls: ['./edit-name-modal.component.css'],
})
export class EditNameModalComponent implements OnInit {
  updatedName: string;
  id: string;
  @ViewChild('updateNameForm') updateNameForm: NgForm;
  pageUser;
  loadUser;

  constructor(
    public bsModalRef: BsModalRef,
    private _portfolioService: PortfolioService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  updatePortfolioName(id: string, updatedName: string) {
    this._portfolioService
      .updatePortfolioName(id, updatedName)
      .subscribe(() => {
        this._toastrService.success('Successfully renamed portfolio.');
        // this.updateNameForm.reset();
        // console.log(this.pageUser.portfolios);

        for (let portfolio of this.pageUser.portfolios) {
          if (portfolio.id === id) {
            portfolio.name = updatedName;
          }
        }

        this.loadUser();

        this.bsModalRef.hide();
      });
  }
}
