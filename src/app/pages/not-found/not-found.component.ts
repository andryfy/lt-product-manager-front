import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, NzResultModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private location = inject(Location);

  previous(): void {
    this.location.back();
  }
}
