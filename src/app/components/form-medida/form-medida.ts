import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MedidaService } from '../../core/services/medida-service';
import { IMedidaPost } from '../../core/interfaces/hito';

@Component({
  selector: 'app-form-medida',
  imports: [
    DrawerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    Checkbox,
    ToastModule,
    ConfirmPopupModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './form-medida.html',
  styleUrl: './form-medida.css'
})
export class FormMedida implements OnInit {
  @Output() medidaCreada = new EventEmitter<string>();
  @Input() hitoId!: number;
  @Input() hitoNombre!: string;

  right: boolean = false;
  medidaForm!: FormGroup;
  checked: boolean = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private medidaService: MedidaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.medidaForm = this.fb.group({
      Este: ['', Validators.required],
      Norte: ['', Validators.required],
      Elevacion: ['', Validators.required],
      FechaMedicion: ['', Validators.required],
      checked: [false]
    });
  }

  clearForm() {
    this.medidaForm.reset();
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
        const formValue = this.medidaForm.value;
        const medida: IMedidaPost = {
          Este: parseFloat(formValue.Este),
          Norte: parseFloat(formValue.Norte),
          Elevacion: parseFloat(formValue.Elevacion),
          FechaMedicion: formValue.FechaMedicion.toISOString().split('T')[0],
          HitoId: this.hitoId,
          EsBase: formValue.checked || false
        };
        this.medidaService.addMeasurement(medida).subscribe({
          next: () => {
            this.right = false;
            this.clearForm();
            this.medidaCreada.emit('La medida fue creada exitosamente.');
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
