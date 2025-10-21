import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IMesasurementPiezometroPost } from '../../core/interfaces/piezometro';
import { PiezometroService } from '../../core/services/piezometro-service';

@Component({
  selector: 'app-form-medida-piezometro',
  imports: [
    DrawerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ToastModule,
    ConfirmPopupModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './form-medida-piezometro.html',
  styleUrl: './form-medida-piezometro.css'
})
export class FormMedidaPiezometro implements OnInit {
  @Output() medidaPiezometroCreada = new EventEmitter<string>();
  @Input() piezometroId!: number;
  @Input() piezometroNombre!: string;

  right: boolean = false;
  piezometroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private piezometroService: PiezometroService
  ) { }

  ngOnInit() {
    this.piezometroForm = this.fb.group({
      LongitudMedicion: ['', Validators.required],
      FechaMedicion: ['', Validators.required],
      Comentario: ['', Validators.required],
    })
  }

  clearForm() {
    this.piezometroForm.reset();
  }

  confirm(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Está seguro de crear la medida?',
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
        const formValue = this.piezometroForm.value;
        const medida: IMesasurementPiezometroPost = {
          LongitudMedicion: parseFloat(formValue.LongitudMedicion),
          Comentario: formValue.Comentario,
          FechaMedicion: formValue.FechaMedicion.toISOString().split('T')[0],
          PiezometerId: this.piezometroId
        };
        this.piezometroService.addMeasurement(medida).subscribe({
          next: () => {
            this.right = false;
            this.clearForm();
            this.medidaPiezometroCreada.emit('La medida fue creada exitosamente.');
          },
          error: (error) => {
            if (error.status === 400 && error.error?.message) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
                life: 5000
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al crear la medida. Intente nuevamente.',
                life: 5000
              });
            }
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'No se creó la medida',
          life: 3000,
        });
      }
    });
  }
}

