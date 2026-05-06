import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { SearchStore } from '../../../core/stores/searchStore';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  store = inject(SearchStore);
}
