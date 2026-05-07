import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import {
  Album,
  AlbumDetail,
  Artist,
  ListResponse,
  SearchResponse,
  Track,
} from '../models/searchModel';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  private http = inject(HttpClient);
  private readonly BASE = '/api';

  searchAll(query: string, limit = 12): Observable<SearchResponse> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return forkJoin({
      artists: this.http.get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params }),
      albums: this.http.get<ListResponse<Album>>(`${this.BASE}/search/album`, { params }),
      tracks: this.http.get<ListResponse<Track>>(`${this.BASE}/search`, { params }),
    });
  }

  searchArtists(query: string, limit = 20): Observable<Artist[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Artist>>(`${this.BASE}/search/artist`, { params })
      .pipe(map((r) => r.data));
  }

  searchAlbums(query: string, limit = 20): Observable<Album[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Album>>(`${this.BASE}/search/album`, { params })
      .pipe(map((r) => r.data));
  }

  searchTracks(query: string, limit = 20): Observable<Track[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/search`, { params })
      .pipe(map((r) => r.data));
  }

  getChart(limit = 50): Observable<Track[]> {
    const params = new HttpParams().set('limit', limit);

    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/chart/0/tracks`, { params })
      .pipe(map((res) => res.data.map((track) => this.mapToDeezerTrack(track))));
  }

  getArtist(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.BASE}/artist/${id}`);
  }

  getArtistAlbums(id: number, limit = 40): Observable<Album[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<ListResponse<Album>>(`${this.BASE}/artist/${id}/albums`, { params })
      .pipe(map((r) => r.data));
  }

  getArtistTopTracks(id: number, limit = 5): Observable<Track[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<ListResponse<Track>>(`${this.BASE}/artist/${id}/top`, { params })
      .pipe(map((r) => r.data));
  }

  getAlbum(id: number): Observable<AlbumDetail> {
    return this.http.get<AlbumDetail>(`${this.BASE}/album/${id}`);
  }

  private mapToDeezerTrack(track: Track): Track {
    return {
      id: track.id,
      title: track.title,
      title_short: track.title_short,
      duration: track.duration,
      preview: track.preview,
      artist: track.artist,
      album: track.album,
    } as Track;
  }
}
