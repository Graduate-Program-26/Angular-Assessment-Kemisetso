import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistDetail, SearchResponse } from '../models/deezer';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  base = '/api';
  private http = inject(HttpClient);

  searchArtist(query: string): Observable<SearchResponse<ArtistDetail>> {
    const params = new HttpParams().set('q', query).set('limit', 20);
    return this.http.get<SearchResponse<ArtistDetail>>(`${this.base}/search/artist`, { params });
  }
}
