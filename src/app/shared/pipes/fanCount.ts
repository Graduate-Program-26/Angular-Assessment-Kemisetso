import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fanCount',
  standalone: true,
  pure: true,
})
export class FanCountPipe implements PipeTransform {
  transform(count: number): string {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}K`;
    }
    return count.toString();
  }
}
