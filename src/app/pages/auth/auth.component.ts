import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less'
})
export class AuthComponent {

}
