import { Pipe } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, length?: number, terminater?: string) : string {
    let limit = length ?? 150;
    let trail = terminater ?? '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
