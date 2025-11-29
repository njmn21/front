import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

import { IHitoGetWithCoordinates, IHitoPost } from '../../core/interfaces/hito';
import { HitoService } from '../../core/services/hito-service';
import { IDepositoGet } from '../../core/interfaces/deposito';

@Component({
  selector: 'app-show-hito',
  imports: [
    Dialog,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './show-hito.html',
  styleUrl: './show-hito.css'
})
export class ShowHito implements OnInit, OnChanges {
  @Input() hito: IHitoGetWithCoordinates | null = null;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() hitoUpdated = new EventEmitter<void>();

  isEditMode: boolean = false;
  isLoading: boolean = false;
  editForm: any = {};
  depositos: IDepositoGet[] = [];

  constructor(
    private hitoService: HitoService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.hito) {
      this.resetEditForm();
    }
  }

  cerrar() {
    this.isEditMode = false;
    this.resetEditForm(); // Resetear el formulario al cerrar
    this.close.emit();
  }

  resetEditForm() {
    if (this.hito) {
      this.editForm = {
        nombreHito: this.hito.nombreHito || '',
        descripcion: this.hito.descripcion || ''
      }
    } else {
      this.editForm = {
        nombreHito: '',
        descripcion: ''
      }
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
    if (!this.hito || !this.editForm) return;

    // Validaciones básicas
    if (!this.editForm.nombreHito || this.editForm.nombreHito.trim() === '') {
      this.mostrarErrorToast('El nombre del hito es obligatorio.');
      return;
    }

    this.isLoading = true;
    const updatedHito: IHitoPost = {
      NombreHito: this.editForm.nombreHito.trim(),
      DepositoId: this.hito.depositoId,
      Descripcion: this.editForm.descripcion ? this.editForm.descripcion.trim() : ''
    };

    this.hitoService.updateHito(this.hito.hitoId, updatedHito).subscribe({
      next: () => {
        this.isLoading = false;
        this.mostrarToast('Hito actualizado correctamente.');
        this.hitoUpdated.emit();
        this.isEditMode = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar el hito:', error);
        this.mostrarErrorToast('Error al actualizar el hito.');
      }
    });
  }

  mostrarToast(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 3000
    });
  }

  mostrarErrorToast(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
      life: 3000
    });
  }
}
