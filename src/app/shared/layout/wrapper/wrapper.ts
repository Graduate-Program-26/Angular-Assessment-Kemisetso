import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal } from '@angular/core';
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

  @ViewChild('mainContent') private mainContent?: ElementRef<HTMLElement>;

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onDrawerVisibilityChange(isVisible: boolean): void {
    this.mobileMenuOpen.set(isVisible);
  }

  focusMainContent(): void {
    queueMicrotask(() => this.mainContent?.nativeElement.focus());
  }
}
