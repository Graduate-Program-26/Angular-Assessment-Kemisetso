import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { SearchStore } from '../../../core/stores/searchStore';
import { PlaylistStore } from '../../../core/stores/playlistStore';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  store = inject(SearchStore);
  playlistStore = inject(PlaylistStore);
  navSelected = output<void>();

  closeNavigation(): void {
    this.navSelected.emit();
  }
}
