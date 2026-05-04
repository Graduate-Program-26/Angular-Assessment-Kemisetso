import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistDetail, SearchResponse, Track } from '../models/deezer';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  base = 'https://api.deezer.com';
  private http = inject(HttpClient);

  searchArtist(query: string): Observable<SearchResponse<ArtistDetail>> {
    const params = new HttpParams().set('q', query).set('limit', 20);
    return this.http.get<SearchResponse<ArtistDetail>>(`${this.base}/search/artist`, { params });
  }

  searchTracks(query: string): Observable<SearchResponse<Track>> {
    const params = new HttpParams().set('q', query).set('limit', 20);
    return this.http.get<SearchResponse<Track>>(`${this.base}/search`, { params });
  }
}
