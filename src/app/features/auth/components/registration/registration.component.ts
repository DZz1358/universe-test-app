import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { StorageService } from '../../../../shared/service/storage.service';
import { AuthService } from '../../service/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { userRole } from '../../../../shared/const/status-user.const';
import { LoginResponse, RegisterResponse } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatCardModule, MatSelectModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true,
})
export class RegistrationComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  storageService = inject(StorageService);
  destroy$ = new Subject<void>();
  errorMessage = signal('');
  hide = signal(true);

  public roles = signal(userRole);

  get fullNameFC(): FormControl {
    return this.registerForm.get('fullName') as FormControl;
  }
  get emailFC(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordFC(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get roleFC(): FormControl {
    return this.registerForm.get('role') as FormControl;
  }


  public registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  updateErrorMessage() {
    if (this.emailFC.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.emailFC.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  submit(registerForm: any) {
    const data = registerForm.value;
    const { password } = data;

    this.authService.registration(data)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((response: RegisterResponse) =>
          this.authService.login({ email: response.email, password })
        )
      )
      .subscribe({
        next: (loginResponse: any) => {
          this.storageService.setToLocalStore('access_token', loginResponse.access_token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }


}
