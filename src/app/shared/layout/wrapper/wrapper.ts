import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Playbar } from '../../components/playbar/playbar';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterLink,
  RouterOutlet,
  UrlSegment,
} from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { filter, merge, startWith } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { PlaylistStore } from '../../../core/stores/playlistStore';

interface Breadcrumb {
  label: string;
  url: string;
}

type BreadcrumbLabel = string | ((data: Data, route: ActivatedRouteSnapshot) => string);

@Component({
  selector: 'app-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Sidebar, Playbar, RouterOutlet, RouterLink, DrawerModule],
  templateUrl: './wrapper.html',
  styleUrl: './wrapper.scss',
})
export class Wrapper {
  readonly mobileMenuOpen = signal(false);
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly playlistStore = inject(PlaylistStore);

  @ViewChild('mainContent') private mainContent?: ElementRef<HTMLElement>;

  constructor() {
    merge(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
      toObservable(this.playlistStore.playlists),
    )
      .pipe(startWith(null), takeUntilDestroyed())
      .subscribe(() => {
        this.breadcrumbs.set(this.buildBreadcrumbs());
      });
  }

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

  navigateBack(): void {
    this.location.back();
  }

  private buildBreadcrumbs(): Breadcrumb[] {
    const crumbs: Breadcrumb[] = [{ label: 'Home', url: '/home' }];
    let route: ActivatedRoute | null = this.activatedRoute.root;
    let url = '';

    while (route) {
      const child: ActivatedRoute | undefined = route.children.find(
        (candidate: ActivatedRoute) => candidate.outlet === PRIMARY_OUTLET,
      );
      if (!child) break;

      const segment = child.snapshot.url.map((part: UrlSegment) => part.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }

      const parent = child.snapshot.data['breadcrumbParent'] as Breadcrumb | undefined;
      if (parent) {
        this.addBreadcrumb(crumbs, parent);
      }

      const label = this.resolveBreadcrumbLabel(child.snapshot);
      if (label) {
        this.addBreadcrumb(crumbs, { label, url: url || '/home' });
      }

      route = child;
    }

    return crumbs;
  }

  private resolveBreadcrumbLabel(route: ActivatedRouteSnapshot): string | null {
    const breadcrumb = route.data['breadcrumb'] as BreadcrumbLabel | undefined;
    if (!breadcrumb) return null;

    const label = typeof breadcrumb === 'function' ? breadcrumb(route.data, route) : breadcrumb;
    return this.resolvePlaylistLabel(route, label);
  }

  private resolvePlaylistLabel(route: ActivatedRouteSnapshot, fallback: string): string {
    if (route.routeConfig?.path !== 'playlists/:id') return fallback;

    const playlistId = Number(route.paramMap.get('id'));
    const playlistName = this.playlistStore
      .playlists()
      .find((playlist) => playlist.id === playlistId)?.name;

    return playlistName ?? fallback;
  }

  private addBreadcrumb(crumbs: Breadcrumb[], crumb: Breadcrumb): void {
    const existingIndex = crumbs.findIndex(
      (existingCrumb) => existingCrumb.url === crumb.url || existingCrumb.label === crumb.label,
    );

    if (existingIndex >= 0) {
      crumbs[existingIndex] = crumb;
      return;
    }

    crumbs.push(crumb);
  }
}
