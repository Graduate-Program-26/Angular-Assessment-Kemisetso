import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { PlaybarStore } from '../../../core/stores/playbarStore';
import { DurationPipe } from '../../pipes/duration';
@Component({
  selector: 'app-playbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderModule, FormsModule, DurationPipe],
  templateUrl: './playbar.html',
  styleUrl: './playbar.scss',
})
export class Playbar {
  player = inject(PlaybarStore);
}
