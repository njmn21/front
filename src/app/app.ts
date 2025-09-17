import { Component, signal } from '@angular/core';
import { LeftSidebar } from './components/left-sidebar/left-sidebar';
import { Main } from './components/main/main';

@Component({
  selector: 'app-root',
  imports: [LeftSidebar, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
