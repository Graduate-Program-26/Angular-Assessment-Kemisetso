import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Playbar } from '../../components/playbar/playbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Sidebar, Playbar, RouterOutlet, RouterLink, DrawerModule],
  templateUrl: './wrapper.html',
  styleUrl: './wrapper.scss',
})
export class Wrapper {
  readonly mobileMenuOpen = signal(false);

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
