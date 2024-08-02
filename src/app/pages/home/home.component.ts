import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '@app/config/interfaces';
import { FooterComponent } from '@app/layouts/footer/footer.component';
import { HeaderComponent } from '@app/layouts/header/header.component';
import { UserService } from '@app/services/entities/user.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent {
  private readonly userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.userService.setUser().subscribe();
  }
}
