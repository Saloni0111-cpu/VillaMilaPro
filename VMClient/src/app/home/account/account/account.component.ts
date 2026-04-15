import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: any = {};

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // ✅ SAFE LOAD USER
  loadUser(): void {
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser && storedUser !== 'undefined') {
        const parsed = JSON.parse(storedUser);

        // ✅ map backend fields to frontend
        this.user = {
          name: (parsed.first_name || '') + ' ' + (parsed.last_name || ''),
          email: parsed.email || '',
          mobile: parsed.phone || 'Not provided',
          dob: parsed.dob || 'Not provided',
          gender: parsed.gender || 'Not provided',
          address: parsed.address || 'Not provided',
          emergency: parsed.emergency_contact || 'Not provided'
        };

      } else {
        this.setFallbackUser();
      }

    } catch (error) {
      console.error('Invalid user data in localStorage');
      this.setFallbackUser();
    }
  }

  // ✅ fallback user
  setFallbackUser() {
    this.user = {
      name: 'Guest User',
      email: '',
      dob: 'Not provided',
      gender: 'Not provided',
      mobile: 'Not provided',
      address: 'Not provided'
    };
  }

  // ✅ LOGOUT (CORRECT)
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
