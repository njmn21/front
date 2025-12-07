import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

import { IMeasurementPiezometroGet, IPutMeasurementPiezometro } from '../../core/interfaces/piezometro';
import { PiezometroService } from '../../core/services/piezometro-service';

@Component({
  selector: 'app-show-medida-piezometro',
  imports: [
    ToastModule,
    DialogModule,
    CommonModule,
    FloatLabelModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DatePicker
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './show-medida-piezometro.html',
  styleUrl: './show-medida-piezometro.css'
})
export class ShowMedidaPiezometro implements OnChanges {
  @Input() medida: IMeasurementPiezometroGet | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() medidaUpdated = new EventEmitter<void>();

  isLoading: boolean = false;

  isEditMode: boolean = false;
  editForm: any = {
    FechaMedicion: new Date(),
    LongitudMedicion: 0,
    Comentario: ''
  };

  constructor(
    private readonly piezometroService: PiezometroService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) { }

  ngOnChanges() {
    if (this.medida && this.visible) {
      this.resetForm();
    }
  }

  private resetForm() {
    if (this.medida) {
      const fechaMedicion = new Date(this.medida.fechaMedicion);
      fechaMedicion.setMinutes(fechaMedicion.getMinutes() + fechaMedicion.getTimezoneOffset());

      this.editForm = {
        FechaMedicion: fechaMedicion,
        LongitudMedicion: this.medida.longitudMedicion,
        Comentario: this.medida.comentario || ''
      };
    }
  }

  editarMedida() {
    this.isEditMode = true;
    this.resetForm();
  }

  cancelarEdicion() {
    this.isEditMode = false;
    this.resetForm();
  }

  guardarCambios() {
    if (this.medida && this.medida.medicionId) {
      const fechaMedicion = this.editForm.FechaMedicion instanceof Date
        ? new Date(this.editForm.FechaMedicion.getTime() - this.editForm.FechaMedicion.getTimezoneOffset() * 60000).toISOString().split('T')[0]
        : this.editForm.FechaMedicion;

      const updateData: IPutMeasurementPiezometro = {
        FechaMedicion: fechaMedicion,
        LongitudMedicion: Number(this.editForm.LongitudMedicion),
        Comentario: this.editForm.Comentario || ''
      };

      this.piezometroService.updateMeasurement(this.medida.medicionId, updateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Medición actualizada correctamente'
          });
          this.isEditMode = false;
          this.medidaUpdated.emit();
          this.cerrar();
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar la medición'
          });
        }
      });
    }
  }

  cerrar() {
    this.isEditMode = false;
    this.close.emit();
  }
}
