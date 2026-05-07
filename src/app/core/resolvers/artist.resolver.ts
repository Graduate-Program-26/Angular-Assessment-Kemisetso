import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { Album, Artist, Track } from '../models/searchModel';
import { DeezerService } from '../services/deezerService';

export interface ArtistResolvedData {
  artist: Artist | null;
  albums: Album[];
  topTracks: Track[];
}

export const artistResolver: ResolveFn<ArtistResolvedData> = (route) => {
  const deezer = inject(DeezerService);
  const artistId = Number(route.paramMap.get('id'));

  if (!Number.isFinite(artistId)) {
    return of({ artist: null, albums: [], topTracks: [] });
  }

  return forkJoin({
    artist: deezer.getArtist(artistId),
    albums: deezer.getArtistAlbums(artistId),
    topTracks: deezer.getArtistTopTracks(artistId),
  }).pipe(catchError(() => of({ artist: null, albums: [], topTracks: [] })));
};
