import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../core/auth/authService';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected login(): void {
    this.auth.login();
  }
}
