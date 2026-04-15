import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthCarouselComponent } from '../auth-carousel/auth-carousel.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCarouselComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword = false;
  errorMsg = '';

  loginForm!: FormGroup;

  carouselImages = [
    'assets/login-img.jpeg',
    'assets/login-img.jpeg',
    'assets/login-img.jpeg'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }
    submit() {
  if (this.loginForm.invalid) return;

  const payload = {
    email: this.loginForm.value.email,   // ✅ IMPORTANT
    password: this.loginForm.value.password,
     remember_me: this.loginForm.value.rememberMe
  };

  this.authService.login(payload).subscribe({
    next: (res: any) => {
      this.authService.saveAuth(res);
      this.router.navigate(['/account/profile']);
    },
    error: (err: any) => {
      if (err.error) {
        if (typeof err.error === 'string') {
          this.errorMsg = err.error;
        } else if (err.error.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else if (err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          // Flatten field errors like {"email": ["Invalid email"]}
          const fieldErrors = Object.values(err.error).flat();
          this.errorMsg = fieldErrors[0] as string || 'Login failed';
        }
      } else {
        this.errorMsg = 'Login failed. Please check your connection.';
      }
    }
  });
}
}
