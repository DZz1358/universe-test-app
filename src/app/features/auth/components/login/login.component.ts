import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../../../shared/service/storage.service';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule],
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageService = inject(StorageService);
  public errorMessage = signal('');
  public hide = signal(true);
  private destroyRef = inject(DestroyRef);

  get emailFC(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordFC(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  updateErrorMessage(): void {
    if (this.emailFC.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.emailFC.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  submit(loginForm: any): void {
    const data = loginForm.value;
    this.authService.login(data).pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe({
        next: (response: any) => {
          this.storageService.setToLocalStore('access_token', response.access_token);
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.errorMessage = err.message;
        },
      });
  }

}
