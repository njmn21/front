import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-show-deposito',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FloatLabelModule
  ],
  templateUrl: './show-deposito.html',
  styleUrl: './show-deposito.css'
})
export class ShowDeposito {
  @Input() deposito: any;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}