import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { IMedidaGet, IMedidaPost } from '../../core/interfaces/hito';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MedidaService } from '../../core/services/medida-service';

@Component({
  selector: 'app-show-medida',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FloatLabelModule,
    FormsModule,
    DatePicker,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './show-medida.html',
  styleUrl: './show-medida.css'
})
export class ShowMedida implements OnChanges {
  @Input() medida: IMedidaGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() medidaUpdated = new EventEmitter<void>();

  isEditMode: boolean = false;
  editForm: any = {};
  isLoading: boolean = false;

  constructor(
    private medidaService: MedidaService,
    private messageService: MessageService,
  ) { }

  ngOnChanges() {
    if (this.medida) {
      this.resetEditForm();
    }
  }

  resetEditForm() {
    if (this.medida) {
      this.editForm = {
        norte: this.medida.norte,
        este: this.medida.este,
        elevacion: this.medida.elevacion,
        fechaMedicion: this.medida.fechaMedicion ? this.createLocalDate(this.medida.fechaMedicion) : null
      };
    }
  }

  createLocalDate(dateString: string): Date | null {
    if (!dateString) return null;

    const dateParts = dateString.split('T')[0].split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2], 10);

    return new Date(year, month, day);
  }

  enableEditMode() {
    this.isEditMode = true;
    this.resetEditForm();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.resetEditForm();
  }

  saveChanges() {
    if (!this.medida || !this.editForm) return;

    this.isLoading = true;
    const medidaEdit: IMedidaPost = {
      Este: this.editForm.este,
      Norte: this.editForm.norte,
      Elevacion: this.editForm.elevacion,
      FechaMedicion: this.formatDate(this.editForm.fechaMedicion),
      HitoId: this.medida.hitoId,
      EsBase: false
    };

    this.medidaService.editMeasurement(this.medida.medicionId, medidaEdit).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEditMode = false;
        this.mostrarToast('Medida actualizada correctamente.');
        this.medidaUpdated.emit();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar medida:', error);
        this.mostrarToastError('Error al actualizar la medida. Por favor, inténtelo de nuevo.');
      }
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cerrar() {
    this.isEditMode = false;
    this.close.emit();
  }

  mostrarToast(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 3000
    });
  }

  mostrarToastError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
      life: 3000
    });
  }
}
