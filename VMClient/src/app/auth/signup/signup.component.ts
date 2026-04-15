import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthCarouselComponent } from "../auth-carousel/auth-carousel.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthCarouselComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  showPassword = false;
  showConfirm = false;
  errorMsg = '';
  successMsg = '';
  loading = false;

  signupForm!: FormGroup;

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
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { firstName, lastName, email, phone, password, confirmPassword, terms } = this.signupForm.value;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      password: password,
      confirm_password: confirmPassword,
      agree_terms: terms
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        // The backend might return errors as arrays, e.g., err.error.email[0]
        this.errorMsg = err.error?.non_field_errors?.[0] ||
          err.error?.email?.[0] ||
          err.error?.phone?.[0] ||
          'Registration failed. Please check your details.';
      }
    });
  }
}
