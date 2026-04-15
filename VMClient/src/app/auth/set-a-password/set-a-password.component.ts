import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthCarouselComponent } from "../auth-carousel/auth-carousel.component";

@Component({
  selector: 'app-set-a-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthCarouselComponent],
  templateUrl: './set-a-password.component.html',
  styleUrl: './set-a-password.component.scss'
})
export class SetAPasswordComponent implements OnInit {

  showPassword = false;
  showConfirm = false;
  email = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  setpasswordForm: FormGroup;

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
    this.setpasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = history.state.email;
    if (!this.email) {
      this.router.navigate(['/forgotpassword']);
    }
  }

  submit(): void {
    if (this.setpasswordForm.invalid) {
      this.setpasswordForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.setpasswordForm.value;

    if (password !== confirmPassword) {
      this.setpasswordForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.errorMsg = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.setPassword(this.email, password, confirmPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = 'Password successfully updated! Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.non_field_errors?.[0] || 'Failed to set password.';
      }
    });
  }
}
