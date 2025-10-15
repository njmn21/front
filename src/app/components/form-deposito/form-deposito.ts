import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Deposito } from '../../core/services/deposito';
import { IDepositoPost } from '../../core/interfaces/deposito';

@Component({
  selector: 'app-form-deposito',
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    DatePickerModule,
    FluidModule,
    ConfirmPopupModule,
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './form-deposito.html',
  styleUrl: './form-deposito.css'
})
export class FormDeposito {
  @Output() depositoCreado = new EventEmitter<string>();

  errorMsg: string | null = null;
  rigth: boolean = false;
  depositoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private depositoService: Deposito,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.depositoForm = this.fb.group({
      NombreDeposito: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      FechaCreacion: ['', Validators.required],
      ZonaUtm: ['', Validators.required],
      CoordenadaEste: ['', Validators.required],
      CoordenadaNorte: ['', Validators.required]
    });
  }

  clearForm() {
    this.depositoForm.reset();
  }

  confirm(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Está seguro que desea guardar el depósito?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Guardar',
      },
      accept: () => {
        const formValue = this.depositoForm.value;
        const deposito: IDepositoPost = {
          NombreDeposito: formValue.NombreDeposito,
          Ubicacion: formValue.Ubicacion,
          FechaCreacion: formValue.FechaCreacion.toISOString().split('T')[0],
          ZonaUtm: formValue.ZonaUtm,
          CoordenadaEste: formValue.CoordenadaEste,
          CoordenadaNorte: formValue.CoordenadaNorte
        };
        this.depositoService.addDeposito(deposito).subscribe({
          next: () => {
            this.rigth = false;
            this.clearForm();
            this.depositoCreado.emit('El depósito fue guardado exitosamente.');
          },
          error: (err) => {
            this.errorMsg = 'Error al crear el depósito. Intente nuevamente.';
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'No se guardó el depósito',
          life: 3000,
        });
      },
    });
  }
}
