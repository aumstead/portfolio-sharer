import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppUser } from 'src/app/_models/appUser';
import { DeletePortfolioModalComponent } from '../delete-portfolio-modal/delete-portfolio-modal.component';
import { EditNameModalComponent } from '../edit-name-modal/edit-name-modal.component';

@Component({
  selector: 'app-table-menu-header',
  templateUrl: './table-menu-header.component.html',
  styleUrls: ['./table-menu-header.component.css'],
})
export class TableMenuHeaderComponent implements OnInit {
  isCollapsed = true;
  @Input() tableData = [];
  @Input() currentTabIndex: number = 0;
  @Input() currentPortfolioId: number;
  @Input() currentPortfolioName: string;
  @Input() isPageUserLoggedInUser: boolean;
  bsModalRef: BsModalRef;
  @Input() pageUser: AppUser;
  @Input() loadUser;

  constructor(private _modalService: BsModalService) {}

  openEditNameModal() {
    this.bsModalRef = this._modalService.show(EditNameModalComponent);
    this.bsModalRef.content.id = this.currentPortfolioId;
    this.bsModalRef.content.pageUser = this.pageUser;
    this.bsModalRef.content.loadUser = this.loadUser;
  }

  openDeletePortfolioModal() {
    this.bsModalRef = this._modalService.show(DeletePortfolioModalComponent);
    this.bsModalRef.content.id = this.currentPortfolioId;
    this.bsModalRef.content.name = this.currentPortfolioName;
    // this.bsModalRef.content.pageUser = this.pageUser;
    this.bsModalRef.content.loadUser = this.loadUser;
  }

  ngOnInit(): void {}
}
