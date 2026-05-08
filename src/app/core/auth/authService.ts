import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #auth0 = inject(Auth0Service);
  readonly #document = inject(DOCUMENT);

  readonly isAuthenticated = toSignal(this.#auth0.isAuthenticated$, {
    initialValue: false,
  });

  readonly isLoading = toSignal(this.#auth0.isLoading$, {
    initialValue: true,
  });

  readonly user = toSignal<User | null | undefined>(this.#auth0.user$, {
    initialValue: null,
  });

  readonly userDisplayName = toSignal(
    this.#auth0.user$.pipe(map((u) => u?.name ?? u?.email ?? 'Guest')),
    { initialValue: 'Guest' },
  );

  login(): void {
    this.#auth0.loginWithRedirect();
  }

  logout(): void {
    this.#auth0.logout({
      logoutParams: {
        returnTo: this.#document.location.origin,
      },
    });
  }
}
