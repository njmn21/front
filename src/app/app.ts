import { Component, signal, inject, OnInit } from '@angular/core';
import { LeftSidebar } from './components/left-sidebar/left-sidebar';
import { Main } from './features/main/main';
import { AuthService } from './core/services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MapService } from './core/services/map-service';

@Component({
  selector: 'app-root',
  imports: [LeftSidebar, Main, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('front');
  protected authService = inject(AuthService);

  constructor(
    private readonly keyMapsService: MapService
  ) { }

  ngOnInit(): void {
    this.keyMapsService.getKeyMap().subscribe((response) => {
      const apiKey = response.result;
      this.loadGoogleMapsScript(apiKey);
    })
  }

  loadGoogleMapsScript(apiKey: string) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
