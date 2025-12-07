import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';

import { Ubicaciones } from '../../../core/services/ubicaciones';
import { UserMenu } from '../../../components/shared/user-menu/user-menu';

interface Instrument {
  name: string;
  code: string;
}

interface UbicacionHito {
  nombreHito: string;
  latitud: number;
  longitud: number;
  selected?: boolean;
}

interface UbicacionPiezometro {
  nombreHito: string;
  latitud: number;
  longitud: number;
  selected?: boolean;
}

@Component({
  selector: 'app-ubicaciones-mapa',
  imports: [
    FormsModule,
    Select,
    UserMenu,
    CommonModule,
    CheckboxModule
  ],
  templateUrl: './ubicaciones-mapa.html',
  styleUrl: './ubicaciones-mapa.css'
})
export class UbicacionesMapa implements OnInit {

  instruments: Instrument[] = [
    { name: 'Hitos topográficos', code: 'hitos' },
    { name: 'Piezómetros de Casagrande', code: 'piezometros' }
  ];

  selectedInstrument: Instrument | undefined;
  ubicaciones: (UbicacionHito | UbicacionPiezometro)[] = [];
  private map: any;
  private markers: any[] = [];

  constructor(
    private readonly ubicacionesService: Ubicaciones
  ) { }

  ngOnInit() {
    this.waitForGoogleMaps();
  }

  waitForGoogleMaps() {
    if ((globalThis as any).google?.maps) {
      this.initMap();
    } else {
      setTimeout(() => this.waitForGoogleMaps(), 100);
    }
  }

  initMap() {
    const google = (globalThis as any).google;
    if (!google?.maps) {
      console.error('Google Maps no está disponible');
      return;
    }

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: -15.799609868304866, lng: -74.24524740970186 },
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });
  }

  loadUbicacionesHitos() {
    this.ubicacionesService.getCoordinatesLandmarks().subscribe({
      next: (response: any) => {
        console.log('Ubicaciones cargadas:', response);
        this.ubicaciones = (response.result || response).map((item: any) => ({
          nombreHito: item.nombreHito,
          latitud: item.latitud,
          longitud: item.longitud,
          selected: false
        }));
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones:', error);
      }
    });
  }

  loadUbicacionesPiezometros() {
    this.ubicacionesService.getCoordinatesPiezometers().subscribe({
      next: (response: any) => {
        console.log('Ubicaciones de piezómetros cargadas:', response);
        this.ubicaciones = (response.result || response).map((item: any) => ({
          nombreHito: item.nombreHito,
          latitud: item.latitud,
          longitud: item.longitud,
          selected: false
        }));
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones de piezómetros:', error);
      }
    });
  }

  onUbicacionChange() {
    this.clearMarkers();
    const selectedUbicaciones = this.ubicaciones.filter(u => u.selected);
    if (selectedUbicaciones.length > 0) {
      const type = this.selectedInstrument?.code || 'ubicacion';
      this.addMarkersToMap(selectedUbicaciones, type);
    }
  }

  private clearMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  private addMarkersToMap(locations: any[], type: string) {
    if (!this.map || !(globalThis as any).google?.maps) {
      return;
    }

    const google = (globalThis as any).google;

    for (const location of locations) {
      const lat = location.latitud || location.lat || location.latitude;
      const lng = location.longitud || location.lng || location.longitude || location.lon;

      if (lat && lng) {
        const marker = new google.maps.Marker({
          position: { lat: Number(lat), lng: Number(lng) },
          map: this.map,
          title: location.nombreHito || location.name || location.title || `${type} - ${location.id}`,
          icon: type === 'hitos' ?
            'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
            'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        this.markers.push(marker);

        // Agregar info window
        const infoContent = this.createInfoWindowContent(location, type, lat, lng);
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      }
    }
  }

  private createInfoWindowContent(location: any, type: string, lat: number, lng: number): string {
    const title = location.nombreHito || location.name || location.title || `${type} - ${location.id}`;
    return `${title} - Lat: ${lat}, Lng: ${lng}`;
  }

  onCityChange(selectedInstrument: string) {
    this.ubicaciones = [];
    this.clearMarkers();

    if (selectedInstrument === 'hitos') {
      this.loadUbicacionesHitos();
    } else if (selectedInstrument === 'piezometros') {
      this.loadUbicacionesPiezometros();
    }
  }
}
