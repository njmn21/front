import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { IPiezometroGet, IPutPiezometro } from '../../core/interfaces/piezometro';
import { PiezometroService } from '../../core/services/piezometro-service';

@Component({
  selector: 'app-show-piezometro',
  imports: [
    Dialog,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    ButtonModule,
    DatePicker,
    FormsModule,
    Toast
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './show-piezometro.html',
  styleUrl: './show-piezometro.css'
})
export class ShowPiezometro implements OnChanges {
  @Input() piezometro: IPiezometroGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() piezometroActualizado = new EventEmitter<string>();

  isEditMode: boolean = false;
  isLoading: boolean = false;
  editForm: any = {};

  constructor(
    private messageService: MessageService,
    private piezometroService: PiezometroService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['piezometro'] && this.piezometro) {
      this.resetEditForm();
    }
  }

  cerrar() {
    this.close.emit();
  }

  resetEditForm() {
    if (this.piezometro) {
      this.editForm = {
        nombrePiezometro: this.piezometro.nombrePiezometro,
        este: this.piezometro.este,
        norte: this.piezometro.norte,
        elevacion: this.piezometro.elevacion,
        stickUp: this.piezometro.stickUp,
        cotaActualBocaTubo: this.piezometro.cotaActualBocaTubo,
        cotaActualTerreno: this.piezometro.cotaActualTerreno,
        cotaFondoPozo: this.piezometro.cotaFondoPozo,
        fechaInstalacion: new Date(this.piezometro.fechaInstalacion),
        ubicacion: this.piezometro.ubicacion,
        estado: this.piezometro.estado,
        depositoId: this.piezometro.depositoId
      };
    } else {
      this.editForm = {};
    }
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
    if (!this.piezometro) {
      return;
    }

    if (!this.editForm || Object.keys(this.editForm).length === 0) {
      this.resetEditForm();
      return;
    }

    this.isLoading = true;

    let fechaISO: string;
    if (this.editForm.fechaInstalacion instanceof Date) {
      fechaISO = this.editForm.fechaInstalacion.toISOString().split('T')[0];
    } else if (typeof this.editForm.fechaInstalacion === 'string') {
      fechaISO = this.editForm.fechaInstalacion;
    } else {
      fechaISO = this.piezometro.fechaInstalacion;
    }

    const updateData: IPutPiezometro = {
      NombrePiezometro: this.editForm.nombrePiezometro || this.piezometro.nombrePiezometro,
      Este: Number(this.editForm.este || this.piezometro.este),
      Norte: Number(this.editForm.norte || this.piezometro.norte),
      Elevacion: Number(this.editForm.elevacion || this.piezometro.elevacion),
      StickUp: Number(this.editForm.stickUp || this.piezometro.stickUp),
      CotaActualBocaTubo: Number(this.editForm.cotaActualBocaTubo || this.piezometro.cotaActualBocaTubo),
      CotaActualTerreno: Number(this.editForm.cotaActualTerreno || this.piezometro.cotaActualTerreno),
      CotaFondoPozo: Number(this.editForm.cotaFondoPozo || this.piezometro.cotaFondoPozo),
      FechaInstalacion: fechaISO,
      Ubicacion: this.editForm.ubicacion || this.piezometro.ubicacion,
      Estado: this.editForm.estado || this.piezometro.estado,
      DepositoId: this.editForm.depositoId || this.piezometro.depositoId //|| 1
    };

    if (!updateData.NombrePiezometro || updateData.NombrePiezometro.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Validación',
        detail: 'El nombre del piezómetro es requerido',
        life: 5000
      });
      this.isLoading = false;
      return;
    }

    if (isNaN(updateData.Este) || isNaN(updateData.Norte) || isNaN(updateData.Elevacion)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Validación',
        detail: 'Los valores numéricos no son válidos',
        life: 5000
      });
      this.isLoading = false;
      return;
    }

    if (!updateData.DepositoId || updateData.DepositoId <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Validación',
        detail: 'DepositoId no es válido',
        life: 5000
      });
      this.isLoading = false;
      return;
    }

    this.piezometroService.updatePiezometro(this.piezometro.piezometroId, updateData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isEditMode = false;

          if (this.piezometro) {
            this.piezometro = {
              ...this.piezometro,
              nombrePiezometro: this.editForm.nombrePiezometro,
              este: Number(this.editForm.este),
              norte: Number(this.editForm.norte),
              elevacion: Number(this.editForm.elevacion),
              stickUp: Number(this.editForm.stickUp),
              cotaActualBocaTubo: Number(this.editForm.cotaActualBocaTubo),
              cotaActualTerreno: Number(this.editForm.cotaActualTerreno),
              cotaFondoPozo: Number(this.editForm.cotaFondoPozo),
              fechaInstalacion: fechaISO,
              ubicacion: this.editForm.ubicacion,
              estado: this.editForm.estado
            };
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Piezómetro Actualizado',
            detail: 'Los datos del piezómetro se han actualizado correctamente',
            life: 3000
          });

          this.piezometroActualizado.emit('Piezómetro actualizado exitosamente');
        },
        error: (error) => {
          this.isLoading = false;

          let errorMessage = 'Error al actualizar el piezómetro. Por favor, inténtelo de nuevo.';

          if (error.error && error.error.message) {
            errorMessage = `Error del servidor: ${error.error.message}`;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000
          });
        }
      });
  }
}
