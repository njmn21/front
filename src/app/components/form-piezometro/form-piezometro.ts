import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { IDepositoGet } from '../../core/interfaces/deposito';
import { IPiezometroPost } from '../../core/interfaces/piezometro';
import { Deposito } from '../../core/services/deposito';
import { PiezometroService } from '../../core/services/piezometro-service';

@Component({
  selector: 'app-form-piezometro',
  imports: [
    DrawerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    Select,
    ToastModule,
    ConfirmPopupModule,
    DatePickerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './form-piezometro.html',
  styleUrl: './form-piezometro.css'
})
export class FormPiezometro implements OnInit {
  @Output() piezometroCreado = new EventEmitter<string>();

  depositos: IDepositoGet[] = [];
  visible2: boolean = false;
  piezometroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private depositoService: Deposito,
    private piezometroService: PiezometroService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.piezometroForm = this.fb.group({
      NombrePiezometro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Este: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$"), Validators.min(0)]],
      Norte: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$"), Validators.min(0)]],
      Elevacion: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$")]],
      Ubicacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      StickUp: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$"), Validators.min(0)]],
      CotaActualBocaTubo: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$")]],
      CotaActualTerreno: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$")]],
      CotaFondoPozo: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]+)?$")]],
      FechaInstalacion: ['', Validators.required],
      DepositoId: [null, Validators.required]
    });
    this.depositoService.getAllDepositos().subscribe((depositos: IDepositoGet[]) => {
      this.depositos = depositos;
    })
  }

  clearForm() {
    this.piezometroForm.reset();
  }

  confirm(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Estás seguro de crear este Piezómetro?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Guardar',
      },
      accept: () => {
        this.savePiezometro();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'No se creó el piezómetro',
          life: 3000,
        });
      },
    });
  }

  private savePiezometro() {
    if (this.piezometroForm.valid) {
      const formValue = this.piezometroForm.value;

      // Convertir la fecha al formato ISO string si es un objeto Date
      let fechaInstalacion = formValue.FechaInstalacion;
      if (fechaInstalacion instanceof Date) {
        fechaInstalacion = fechaInstalacion.toISOString().split('T')[0];
      }

      const piezometro: IPiezometroPost = {
        NombrePiezometro: formValue.NombrePiezometro?.trim() || '',
        Este: this.parseNumberSafely(formValue.Este),
        Norte: this.parseNumberSafely(formValue.Norte),
        Elevacion: this.parseNumberSafely(formValue.Elevacion),
        Ubicacion: formValue.Ubicacion?.trim() || '',
        StickUp: this.parseNumberSafely(formValue.StickUp),
        CotaActualBocaTubo: this.parseNumberSafely(formValue.CotaActualBocaTubo),
        CotaActualTerreno: this.parseNumberSafely(formValue.CotaActualTerreno),
        CotaFondoPozo: this.parseNumberSafely(formValue.CotaFondoPozo),
        FechaInstalacion: fechaInstalacion,
        DepositoId: parseInt(formValue.DepositoId) || 0
      };

      // Validar que todos los campos tengan valores válidos
      if (!this.validatePiezometroData(piezometro)) {
        return;
      }

      this.piezometroService.createPiezometro(piezometro).subscribe({
        next: () => {
          // No mostrar toast aquí, se manejará en el componente padre
          this.visible2 = false;
          this.clearForm();
          this.piezometroCreado.emit('El piezómetro fue guardado exitosamente');
        },
        error: (err) => {
          console.error('Error completo:', err);

          let errorMessage = 'Ocurrió un error al crear el piezómetro.';

          if (err.status === 400 && err.error?.errors) {
            // Extraer errores específicos de validación
            const validationErrors = err.error.errors;
            const errorDetails = Object.keys(validationErrors).map(key =>
              `${key}: ${validationErrors[key].join(', ')}`
            ).join('\n');
            errorMessage = `Errores de validación:\n${errorDetails}`;
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000,
          });
        }
      });
    } else {
      // Mostrar errores específicos del formulario
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, completa todos los campos requeridos correctamente',
        life: 3000,
      });
    }
  }

  private validatePiezometroData(piezometro: IPiezometroPost): boolean {
    if (!piezometro.NombrePiezometro || piezometro.NombrePiezometro.length < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre del piezómetro debe tener al menos 3 caracteres',
        life: 3000,
      });
      return false;
    }

    if (!piezometro.Ubicacion || piezometro.Ubicacion.length < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La ubicación debe tener al menos 3 caracteres',
        life: 3000,
      });
      return false;
    }

    if (!piezometro.FechaInstalacion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La fecha de instalación es requerida',
        life: 3000,
      });
      return false;
    }

    if (!piezometro.DepositoId || piezometro.DepositoId <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe seleccionar un depósito válido',
        life: 3000,
      });
      return false;
    }

    return true;
  }

  private markFormGroupTouched() {
    Object.keys(this.piezometroForm.controls).forEach(key => {
      const control = this.piezometroForm.get(key);
      control?.markAsTouched();
    });
  }

  private parseNumberSafely(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
