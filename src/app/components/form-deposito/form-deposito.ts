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
import { Deposito } from '../../services/deposito';
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
    FluidModule
  ],
  templateUrl: './form-deposito.html',
  styleUrl: './form-deposito.css'
})
export class FormDeposito {
  @Output() depositoCreado = new EventEmitter<void>();

  errorMsg: string | null = null;

  rigth: boolean = false;
  depositoForm: FormGroup;
  readOnly: boolean = false;

  constructor(
    private fb: FormBuilder,
    private depositoService: Deposito
  ) {
    this.depositoForm = this.fb.group({
      NombreDeposito: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      FechaCreacion: ['', Validators.required]
    });
  }

  limpiarFormulario() {
    this.depositoForm.reset();
    this.readOnly = false;
  }

  onSubmit() {
    this.errorMsg = null;
    if (this.depositoForm.valid) {
      const formValue = this.depositoForm.value;
      const deposito: IDepositoPost = {
        NombreDeposito: formValue.NombreDeposito,
        Ubicacion: formValue.Ubicacion,
        FechaCreacion: formValue.FechaCreacion.toISOString().split('T')[0]
      };
      this.depositoService.addDeposito(deposito).subscribe({
        next: () => {
          this.rigth = false;
          this.limpiarFormulario();
          this.depositoCreado.emit();
        },
        error: (err) => {
          this.errorMsg = 'Error al crear el depósito. Intente nuevamente.';
        }
      });
    }
  }

  openWithData(data: any, readOnly: boolean = false) {
    this.rigth = true;
    this.readOnly = readOnly;
    let fecha: Date | string = '';
    if (data.fechaCreacion) {
      const [year, month, day] = data.fechaCreacion.split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    }
    this.depositoForm.patchValue({
      NombreDeposito: data.nombreDeposito,
      Ubicacion: data.ubicacion,
      FechaCreacion: fecha
    });
  }
}
