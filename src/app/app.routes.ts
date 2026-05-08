import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';

import { albumResolver } from './core/resolvers/album.resolver';
import { artistResolver } from './core/resolvers/artist.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/wrapper/wrapper').then((m) => m.Wrapper),

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },

      {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((m) => m.Login),
      },

      {
        path: 'search',
        loadComponent: () => import('./features/search/search').then((m) => m.Search),
        canActivate: [authGuardFn],
      },

      {
        path: 'artist/:id',
        loadComponent: () => import('./features/artist/artist').then((m) => m.Artist),
        resolve: { artistData: artistResolver },
        canActivate: [authGuardFn],
      },

      {
        path: 'album/:id',
        loadComponent: () => import('./features/album/album').then((m) => m.Album),
        resolve: { albumData: albumResolver },
        canActivate: [authGuardFn],
      },

      {
        path: 'playlists',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        canActivate: [authGuardFn],
      },

      {
        path: 'playlists/:id',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        canActivate: [authGuardFn],
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
