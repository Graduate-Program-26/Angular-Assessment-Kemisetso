import { Routes } from '@angular/router';
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
        resolve: { artistData: artistResolver },
        title: 'Artist — Deezer',
      },
      {
        path: 'album/:id',
        loadComponent: () => import('./features/album/album').then((m) => m.Album),
        resolve: { albumData: albumResolver },
        title: 'Album — Deezer',
      },
      {
        path: 'playlists',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        title: 'Playlists — Deezer',
      },
      {
        path: 'playlists/:id',
        loadComponent: () => import('./features/playlist/playlist').then((m) => m.Playlist),
        title: 'Playlist — Deezer',
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
