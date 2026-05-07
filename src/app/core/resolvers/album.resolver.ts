import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AlbumDetail } from '../models/searchModel';
import { DeezerService } from '../services/deezerService';

export interface AlbumResolvedData {
  album: AlbumDetail | null;
}

export const albumResolver: ResolveFn<AlbumResolvedData> = (route) => {
  const deezer = inject(DeezerService);
  const albumId = Number(route.paramMap.get('id'));

  if (!Number.isFinite(albumId)) {
    return of({ album: null });
  }

  return deezer.getAlbum(albumId).pipe(
    map((album) => ({ album })),
    catchError(() => of({ album: null })),
  );
};
