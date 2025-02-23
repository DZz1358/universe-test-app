import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../service/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../../../shared/service/storage.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  errorMessage = signal('');
  hide = signal(true);

  get emailFC(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordFC(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });


  ngOnInit(): void {
  }


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

  submit(loginForm: any) {
    const data = loginForm.value;
    this.authService.login(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.storageService.setToLocalStore('access_token', response.access_token);
          // this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          // this.isLoading = false;
          this.errorMessage = err.message;
        },
      });
  }



}
