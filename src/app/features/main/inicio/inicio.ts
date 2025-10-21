import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth-service';
import { UserMenu } from '../../../components/shared/user-menu/user-menu';

@Component({
  selector: 'app-inicio',
  imports: [
    ButtonModule,
    UserMenu
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  logoUrl = '/logo_home.png';
  depositoUrl = '/deposito.png';
  minaUrl = '/mina.png';
  mina2Url = '/mina2.png';

  loading: boolean = false;
  products: any[] = [];
  currentIndex = 0;
  private intervalId: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // Datos de ejemplo para el carousel
    this.products = [
      { name: 'Depósito 1', image: this.depositoUrl },
      { name: 'Depósito 2', image: this.minaUrl },
      { name: 'Depósito 3', image: this.mina2Url }
    ];

    // Iniciar el autoplay del carousel
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  private startAutoplay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }

  private stopAutoplay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  navigateToDeposito() {
    this.router.navigate(['/deposito-relave']);
  }

  navigateToHitos() {
    this.router.navigate(['/hito-topograficos']);
  }

  navigateToPiezometros() {
    this.router.navigate(['/piezometro']);
  }
}
