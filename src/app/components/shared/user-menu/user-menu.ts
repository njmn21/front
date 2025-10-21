import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-user-menu',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenu {

  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
