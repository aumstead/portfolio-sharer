import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
  bsModalRef: BsModalRef;
  constructor(private _modalService: BsModalService) {}

  openEditNameModal() {
    this.bsModalRef = this._modalService.show(EditNameModalComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  ngOnInit(): void {}
}