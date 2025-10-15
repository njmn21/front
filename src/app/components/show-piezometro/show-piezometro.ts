import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { IPiezometroGet } from '../../core/interfaces/piezometro';

@Component({
  selector: 'app-show-piezometro',
  imports: [
    Dialog,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    CommonModule
  ],
  templateUrl: './show-piezometro.html',
  styleUrl: './show-piezometro.css'
})
export class ShowPiezometro {
  @Input() piezometro: IPiezometroGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}
