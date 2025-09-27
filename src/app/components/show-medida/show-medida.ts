import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMedidaGet } from '../../core/interfaces/deposito';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-show-medida',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FloatLabelModule
  ],
  templateUrl: './show-medida.html',
  styleUrl: './show-medida.css'
})
export class ShowMedida {
  @Input() medida: IMedidaGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}
