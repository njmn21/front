import { Component, signal, inject } from '@angular/core';
import { LeftSidebar } from './components/left-sidebar/left-sidebar';
import { Main } from './features/main/main';
import { AuthService } from './core/services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [LeftSidebar, Main, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
  protected authService = inject(AuthService);
}
