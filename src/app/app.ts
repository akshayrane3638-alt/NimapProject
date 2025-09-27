import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Add RouterModule here
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // corrected property name
})
export class App {
  protected readonly title = signal('FRONTEND-NEW');
}
