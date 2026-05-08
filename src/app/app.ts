// app.ts
import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/auth/authService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.auth.isLoading()) return;

      if (this.auth.isAuthenticated()) {
        const currentUrl = this.router.url;
        if (currentUrl === '/' || currentUrl === '/home' || currentUrl === '/login') {
          this.router.navigate(['/search']);
        }
      }
    });
  }
}
