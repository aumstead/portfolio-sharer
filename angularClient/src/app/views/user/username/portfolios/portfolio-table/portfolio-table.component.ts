import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio-table',
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.css'],
})
export class PortfolioTableComponent implements OnInit {
  @Input() tableData = [];
  @Input() currentTabIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
