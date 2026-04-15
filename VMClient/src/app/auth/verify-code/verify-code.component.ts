import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthCarouselComponent } from "../auth-carousel/auth-carousel.component";

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCarouselComponent],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit {

  showCode = false;
  email = '';
  errorMsg = '';
  successMsg = '';
  loading = false;
  resendLoading = false;

  verifycodeForm: FormGroup;

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
    this.verifycodeForm = this.fb.group({
      verifycode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.email = history.state.email;
    if (!this.email) {
      this.router.navigate(['/forgotpassword']);
    }
  }

  submit(): void {
    if (this.verifycodeForm.invalid) {
      this.verifycodeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const otp = this.verifycodeForm.value.verifycode;

    this.authService.verifyOtp(this.email, otp).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = 'OTP verified! Redirecting...';
        setTimeout(() => this.router.navigate(['/setpassword'], { state: { email: this.email } }), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.non_field_errors?.[0] || err.error?.otp?.[0] || 'Invalid OTP.';
      }
    });
  }

  resendCode(): void {
    if (this.resendLoading) return;
    this.resendLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.resendOtp(this.email).subscribe({
      next: () => {
        this.resendLoading = false;
        this.successMsg = 'A new OTP has been sent to your email!';
      },
      error: (err) => {
        this.resendLoading = false;
        this.errorMsg = err.error?.non_field_errors?.[0] || 'Failed to resend OTP.';
      }
    });
  }
}
