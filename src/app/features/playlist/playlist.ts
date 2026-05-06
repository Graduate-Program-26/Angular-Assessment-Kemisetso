import { Component } from '@angular/core';

@Component({
  selector: 'app-playlist',
  imports: [],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
})
export class Playlist {
  readonly playlistsWithStats = toSignal(
    from(
      liveQuery(async (): Promise<PlaylistWithStats[]> => {
        const playlists = await db.playlists.orderBy('createdAt').reverse().toArray();

        return Promise.all(
          playlists.map(async (p) => {
            const tracks: PlaylistTrack[] = await db.playlistTracks
              .where('playlistId')
              .equals(p.id!)
              .toArray();

            const totalDuration = tracks.reduce((s, t) => s + t.duration, 0);
            const firstCover = tracks[0]?.albumCoverMedium ?? null;

            return {
              id: p.id!,
              name: p.name,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              trackCount: tracks.length,
              totalDuration,
              coverUrl: firstCover,
            };
          }),
        );
      }),
    ),
    { initialValue: [] as PlaylistWithStats[] },
  );
}
