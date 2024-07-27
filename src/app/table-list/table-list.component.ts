import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-list',
  standalone: true,
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  imports: [CommonModule]
})
export class TableListComponent {
  @Output() selectTable = new EventEmitter<number>();

  tables = [
    { id: 1, name: 'Masa 1', status: 'Boş' },
    { id: 2, name: 'Masa 2', status: 'Boş' },
    { id: 3, name: 'Masa 3', status: 'Dolu' },
    { id: 4, name: 'Masa 4', status: 'Boş' },
    { id: 5, name: 'Masa 5', status: 'Boş' },
    { id: 6, name: 'Masa 6', status: 'Dolu' },
    { id: 7, name: 'Masa 7', status: 'Boş' },
    { id: 8, name: 'Masa 8', status: 'Boş' },
    { id: 9, name: 'Masa 9', status: 'Dolu' },
    { id: 10, name: 'Masa 10', status: 'Boş' },
    { id: 11, name: 'Masa 11', status: 'Boş' },
    { id: 12, name: 'Masa 12', status: 'Dolu' },
    { id: 13, name: 'Masa 13', status: 'Boş' },
    { id: 14, name: 'Masa 14', status: 'Boş' },
    { id: 15, name: 'Masa 15', status: 'Dolu' }
  ];

  onTableSelect(tableId: number) {
    this.selectTable.emit(tableId);
  }
}
