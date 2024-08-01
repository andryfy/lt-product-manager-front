import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PreloaderService } from './services/common/preloader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  template: `<router-outlet />`,
})
export class AppComponent implements AfterViewInit {
  private readonly preloader: PreloaderService = inject(PreloaderService);

  ngAfterViewInit(): void {
    this.preloader.removePreLoader();
  }
}
