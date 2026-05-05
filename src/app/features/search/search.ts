import { Component, inject, signal } from '@angular/core';
import { SearchStore } from '../../core/services/searchStore';
import { SearchTab } from '../../core/models/searchModel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FanCountPipe } from '../../shared/pipes/fanCount';
import { DurationPipe } from '../../shared/pipes/duration';
@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    ChipModule,
    RippleModule,
    TooltipModule,
    DurationPipe,
    FanCountPipe,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  store = inject(SearchStore);
  protected readonly inputValue = signal<string>('');

  protected readonly tabs: { label: string; value: SearchTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Artists', value: 'artists' },
    { label: 'Albums', value: 'albums' },
    { label: 'Tracks', value: 'tracks' },
  ];

  protected readonly skeletonCards = Array.from({ length: 4 });
  protected readonly skeletonRows = Array.from({ length: 5 });

  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.store.setQuery(value);
  }

  onClear(): void {
    this.inputValue.set('');
    this.store.clearSearch();
  }

  setTab(tab: SearchTab): void {
    this.store.setActiveTab(tab);
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
