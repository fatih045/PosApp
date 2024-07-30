import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../services/table/table.service';
import { Table } from '../Model/Table';

@Component({
  selector: 'app-table-list',
  standalone: true,
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  imports: [CommonModule]
})
export class TableListComponent implements OnInit {
  @Output() selectTable = new EventEmitter<string>();
  @Input() tables: Table[] = [];

  constructor() {}

  async ngOnInit() {
    
  }

  onSelectTable(tableId: string) {
    this.selectTable.emit(tableId);
  }
}
