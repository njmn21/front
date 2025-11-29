import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { Ubicaciones } from '../../../core/services/ubicaciones';
import { UserMenu } from '../../../components/shared/user-menu/user-menu';

@Component({
  selector: 'app-ubicaciones-mapa',
  imports: [
    FormsModule,
    Select,
    UserMenu
  ],
  templateUrl: './ubicaciones-mapa.html',
  styleUrl: './ubicaciones-mapa.css'
})
export class UbicacionesMapa implements OnInit {

  cities: any[] = [
    { name: 'Hitos topográficos', code: 'hitos' },
    { name: 'Piezómetros de Casagrande', code: 'piezometros' }
  ];

  selectedCity: any | undefined;

  constructor(
    private ubicacionesService: Ubicaciones
  ) { }

  ngOnInit() {
  }

  loadUbicacionesHitos() {
    this.ubicacionesService.getCoordinatesLandmarks().subscribe({
      next: (data) => {
        console.log('Ubicaciones cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones:', error);
      }
    });
  }

  loadUbicacionesPiezometros() {
    this.ubicacionesService.getCoordinatesPiezometers().subscribe({
      next: (data) => {
        console.log('Ubicaciones de piezómetros cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones de piezómetros:', error);
      }
    });
  }

  onCityChange(selectedCityCode: string) {
    if (selectedCityCode === 'hitos') {
      this.loadUbicacionesHitos();
    } else if (selectedCityCode === 'piezometros') {
      this.loadUbicacionesPiezometros();
    }
  }
}
