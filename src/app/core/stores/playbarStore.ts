import { computed, Injectable, signal } from '@angular/core';
export interface PlaybarTrack {
  id: number;
  title: string;
  title_short?: string;
  duration: number;
  preview: string;
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
    cover_small: string;
    cover_medium?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PlaybarStore {
  private trackSignal = signal<PlaybarTrack | null>(null);
  private playingSignal = signal(false);
  private progressSignal = signal(0);
  private volumeSignal = signal(80);

  readonly track = this.trackSignal.asReadonly();
  readonly playing = this.playingSignal.asReadonly();
  readonly progress = this.progressSignal.asReadonly();
  readonly volume = this.volumeSignal.asReadonly();

  readonly hasTrack = computed(() => this.trackSignal() !== null);

  private audio: HTMLAudioElement | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;

  play(track: PlaybarTrack): void {
    if (!track.preview) return;

    this.stopAudio();

    this.trackSignal.set(track);
    this.progressSignal.set(0);

    this.audio = new Audio(track.preview);
    this.audio.volume = this.volumeSignal() / 100;
    this.audio.play();
    this.playingSignal.set(true);

    this.interval = setInterval(() => {
      if (this.audio) {
        this.progressSignal.set(Math.floor(this.audio.currentTime));
      }
    }, 500);

    this.audio.addEventListener('ended', () => {
      this.playingSignal.set(false);
      this.progressSignal.set(0);
      if (this.interval) clearInterval(this.interval);
    });
  }

  togglePause(): void {
    if (!this.audio) return;

    if (this.playingSignal()) {
      this.audio.pause();
      this.playingSignal.set(false);
    } else {
      this.audio.play();
      this.playingSignal.set(true);
    }
  }

  setVolume(vol: number): void {
    this.volumeSignal.set(vol);
    if (this.audio) this.audio.volume = vol / 100;
  }

  private stopAudio(): void {
    if (this.interval) clearInterval(this.interval);

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.playingSignal.set(false);
  }
}
