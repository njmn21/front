import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { IHitoGetWithCoordinates } from '../../core/interfaces/hito';

@Component({
  selector: 'app-show-hito',
  imports: [
    Dialog,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    CommonModule
  ],
  templateUrl: './show-hito.html',
  styleUrl: './show-hito.css'
})
export class ShowHito {
  @Input() hito: IHitoGetWithCoordinates | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}
