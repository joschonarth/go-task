import { Component } from '@angular/core';
import { HeaderComponent } from './core/layout/header/header.component';
import { MainContentComponent } from './features/tasks/components/main-content/main-content.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    MainContentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
