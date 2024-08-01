import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ENDPOINTS_APP } from '@app/config/endpoints';
import { ICredential } from '@app/config/interfaces';
import { AuthService } from '@app/services/common/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent {
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly message: NzMessageService = inject(NzMessageService);
  private readonly router: Router = inject(Router);

  loginForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loading: boolean = false;
  passwordVisible: boolean = false;

  login(): void {
    this.loading = true;
    if (this.loginForm.valid) {
      console.log('FormValue', this.loginForm.value);
      const credential: ICredential = this.loginForm.value as ICredential;
      this.authService.signIn(credential).subscribe({
        next: (response: any) => {
          console.log('Response: ', response);
          this.message.success('Bienvenue, vous êtes connécté', {
            nzDuration: 10000,
          });
          this.router.navigate([ENDPOINTS_APP.home]);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
