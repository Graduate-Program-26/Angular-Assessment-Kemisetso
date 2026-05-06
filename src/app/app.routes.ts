import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/wrapper/wrapper').then((m) => m.Wrapper),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Home — Deezer',
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search').then((m) => m.Search),
        title: 'Search — Deezer',
      },
      {
        path: 'artist/:id',
        loadComponent: () => import('./features/artist/artist').then((m) => m.Artist),
        title: 'Artist — Deezer',
      },
      {
        path: 'album/:id',
        loadComponent: () => import('./features/album/album').then((m) => m.Album),
        title: 'Album — Deezer',
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
