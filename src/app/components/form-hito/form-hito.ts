import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Deposito } from '../../core/services/deposito';
import { HitoService } from '../../core/services/hito-service';
import { IHitoPost } from '../../core/interfaces/hito';
import { IDepositoGet } from '../../core/interfaces/deposito';

@Component({
  selector: 'app-form-hito',
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
    ConfirmPopupModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './form-hito.html',
  styleUrl: './form-hito.css'
})
export class FormHito implements OnInit {
  @Output() hitoCreado = new EventEmitter<string>();

  errorMsg: string | null = null
  right: boolean = false;

  depositos: IDepositoGet[] = [];
  selectedDeposito: IDepositoGet | null = null;
  visible2: boolean = false;
  hitoForm!: FormGroup;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private depositoService: Deposito,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hitoService: HitoService
  ) { }

  ngOnInit() {
    this.hitoForm = this.fb.group({
      nombreHito: ['', Validators.required],
      deposito: [null, Validators.required],
      descripcion: ['', Validators.required]
    });
    this.depositoService.getAllDepositos().subscribe((depositos: IDepositoGet[]) => {
      this.depositos = depositos;
    });
  }

  clearForm() {
    this.hitoForm.reset();
  }

  confirm(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Estás seguro de crear este Hito?',
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
        const formValue = this.hitoForm.value;
        const hito: IHitoPost = {
          NombreHito: formValue.nombreHito,
          DepositoId: formValue.deposito.id,
          Descripcion: formValue.descripcion
        };
        this.hitoService.addHito(hito).subscribe({
          next: () => {
            this.visible2 = false;
            this.clearForm();
            this.hitoCreado.emit('El hito fue guardado exitosamente');
          },
          error: (err) => {
            if (err.status === 400 && err.error?.message) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
                life: 5000,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el hito.',
                life: 5000,
              });
            }
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'No se creó el hito',
          life: 3000,
        });
      },
    });
  }

}
