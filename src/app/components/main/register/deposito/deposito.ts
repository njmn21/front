import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-deposito',
  imports: [TableModule, CommonModule, ButtonModule, HttpClientModule],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css'
})
export class Deposito {
  customers = [
    {
      name: 'John Doe',
      country: { name: 'USA' },
      company: 'Acme Inc.',
      representative: { name: 'Jane Smith' }
    },
    {
      name: 'Alice Brown',
      country: { name: 'Canada' },
      company: 'Beta Corp.',
      representative: { name: 'Bob White' }
    },
    {
      name: 'Carlos Ruiz',
      country: { name: 'Mexico' },
      company: 'Gamma LLC',
      representative: { name: 'Maria Lopez' }
    }
  ];

  first = 0;
  rows = 5;

  next() {
    if (!this.isLastPage()) {
      this.first = this.first + this.rows;
    }
  }

  prev() {
    if (!this.isFirstPage()) {
      this.first = this.first - this.rows;
    }
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.first + this.rows >= this.customers.length;
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }
}
