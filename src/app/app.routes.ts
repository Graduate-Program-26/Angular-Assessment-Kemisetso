import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';

import { AlbumResolvedData, albumResolver } from './core/resolvers/album.resolver';
import { ArtistResolvedData, artistResolver } from './core/resolvers/artist.resolver';

const artistBreadcrumb = (data: Record<string, unknown>): string => {
  const resolvedData = data['artistData'] as ArtistResolvedData | undefined;
  return resolvedData?.artist?.name ?? 'Artist';
};

const albumBreadcrumb = (data: Record<string, unknown>): string => {
  const resolvedData = data['albumData'] as AlbumResolvedData | undefined;
  return resolvedData?.album?.title ?? 'Album';
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/wrapper/wrapper').then((m) => m.Wrapper),

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        data: { breadcrumb: 'Home' },
      },

      {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((m) => m.Login),
        data: { breadcrumb: 'Login' },
      },

      {
        path: 'search',
        loadComponent: () => import('./features/search/search').then((m) => m.Search),
        canActivate: [authGuardFn],
        data: { breadcrumb: 'Search' },
      },

      {
        path: 'artist/:id',
        loadComponent: () => import('./features/artist/artist').then((m) => m.Artist),
        resolve: { artistData: artistResolver },
        canActivate: [authGuardFn],
        data: {
          breadcrumb: artistBreadcrumb,
          breadcrumbParent: { label: 'Search', url: '/search' },
        },
      },

      {
        path: 'album/:id',
        loadComponent: () => import('./features/album/album').then((m) => m.Album),
        resolve: { albumData: albumResolver },
        canActivate: [authGuardFn],
        data: {
          breadcrumb: albumBreadcrumb,
          breadcrumbParent: { label: 'Search', url: '/search' },
        },
      },

      {
        path: 'playlists',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        canActivate: [authGuardFn],
        data: { breadcrumb: 'Playlists' },
      },

      {
        path: 'playlists/:id',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        canActivate: [authGuardFn],
        data: {
          breadcrumb: 'Playlist',
          breadcrumbParent: { label: 'Playlists', url: '/playlists' },
        },
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
