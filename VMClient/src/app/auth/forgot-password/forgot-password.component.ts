import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthCarouselComponent } from "../auth-carousel/auth-carousel.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCarouselComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  errorMsg = '';
  successMsg = '';
  loading = false;

  forgotpasswordForm!: FormGroup;

  carouselImages = [
    'assets/login-img.jpeg',
    'assets/login-img.jpeg',
    'assets/login-img.jpeg'
  ]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotpasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.forgotpasswordForm.invalid) {
      this.forgotpasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const email = this.forgotpasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = 'OTP sent! Redirecting...';
        setTimeout(() => this.router.navigate(['/verifycode'], { state: { email } }), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.non_field_errors?.[0] || err.error?.email?.[0] || 'Failed to send OTP.';
      }
    });
  }
}
