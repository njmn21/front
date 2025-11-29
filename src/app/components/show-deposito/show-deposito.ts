import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePicker } from "primeng/datepicker";
import { Toast } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { IDepositoGet } from '../../core/interfaces/deposito';
import { Deposito } from '../../core/services/deposito';

@Component({
  selector: 'app-show-deposito',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FloatLabelModule,
    DatePicker,
    FormsModule,
    Toast
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './show-deposito.html',
  styleUrl: './show-deposito.css'
})
export class ShowDeposito implements OnChanges {
  @Input() deposito: IDepositoGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() depositoUpdated = new EventEmitter<void>();

  isEditMode: boolean = false;
  editForm: any = {};
  isLoading: boolean = false;

  constructor(
    private depositoService: Deposito,
    private messageService: MessageService
  ) { }

  ngOnChanges() {
    if (this.deposito) {
      this.resetEditForm();
    }
  }

  resetEditForm() {
    if (this.deposito) {
      this.editForm = {
        nombreDeposito: this.deposito.nombreDeposito,
        ubicacion: this.deposito.ubicacion,
        zonaUtm: this.deposito.zonaUtm,
        coordenadaEste: this.deposito.coordenadaEste,
        coordenadaNorte: this.deposito.coordenadaNorte,
        fechaCreacion: this.deposito.fechaCreacion ? this.createLocalDate(this.deposito.fechaCreacion) : null
      }
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

  cerrar() {
    this.isEditMode = false;
    this.close.emit();
  }

  enableEditMode() {
    this.resetEditForm();
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.resetEditForm();
  }

  saveChanges() {
    if (!this.deposito || !this.editForm) {
      return;
    }

    // Validar que los campos numéricos sean válidos
    const zonaUtm = Number(this.editForm.zonaUtm);
    const coordenadaEste = Number(this.editForm.coordenadaEste);
    const coordenadaNorte = Number(this.editForm.coordenadaNorte);

    if (isNaN(zonaUtm) || isNaN(coordenadaEste) || isNaN(coordenadaNorte)) {
      this.mostrarToastError('Por favor, ingrese valores numéricos válidos para las coordenadas');
      return;
    }

    this.isLoading = true;
    const editData = {
      NombreDeposito: this.editForm.nombreDeposito,
      Ubicacion: this.editForm.ubicacion,
      ZonaUtm: zonaUtm,
      CoordenadaEste: coordenadaEste,
      CoordenadaNorte: coordenadaNorte,
      FechaCreacion: this.formatDate(this.editForm.fechaCreacion)
    };

    this.depositoService.updateDeposito(this.deposito.id, editData).subscribe({
      next: () => {
        if (this.deposito) {
          this.deposito.nombreDeposito = this.editForm.nombreDeposito;
          this.deposito.ubicacion = this.editForm.ubicacion;
          this.deposito.zonaUtm = zonaUtm;
          this.deposito.coordenadaEste = coordenadaEste;
          this.deposito.coordenadaNorte = coordenadaNorte;
          this.deposito.fechaCreacion = this.formatDate(this.editForm.fechaCreacion);
        }

        this.isLoading = false;
        this.isEditMode = false;
        this.depositoUpdated.emit();
        // Eliminar el toast de aquí para evitar duplicados
        // this.mostrarToast('Depósito actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error en update:', error);
        this.isLoading = false;
        this.mostrarToastError('Error al actualizar el depósito');
        console.error('Error updating deposito:', error);
      }
    });
  }

  mostrarToast(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 5000
    });
  }

  mostrarToastError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
      life: 5000
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
}