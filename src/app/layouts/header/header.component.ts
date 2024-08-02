import { Component, inject } from '@angular/core';
import { User } from '@app/config/interfaces';
import { UserService } from '@app/services/entities/user.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzDropDownModule, NzAvatarModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  private readonly userService: UserService = inject(UserService);

  private subscription!: Subscription;

  user!: User;

  ngOnInit(): void {
    this.subscription = this.userService.user.subscribe({
      next: (user: User) => {
        if (!!user) {
          this.user = user;
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
  }
}
