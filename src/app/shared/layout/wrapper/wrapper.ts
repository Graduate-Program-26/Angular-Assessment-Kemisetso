import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Playbar } from '../../components/playbar/playbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Sidebar, Playbar, RouterOutlet],
  templateUrl: './wrapper.html',
  styleUrl: './wrapper.scss',
})
export class Wrapper {}
