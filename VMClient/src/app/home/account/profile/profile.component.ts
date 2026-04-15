import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = {};
  editBasic = false;
  editContact = false;
  private backupUser: any;
  loading = false;
  errorMsg = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
  this.authService.getProfile().subscribe({
    next: (res: any) => {
      this.user = {
        name: (res.first_name || '') + ' ' + (res.last_name || ''),
        email: res.email || '',
        mobile: res.phone || '',
        dob: res.dob || '',
        gender: res.gender || '',
        address: res.address || '',
        emergency: res.emergency_contact || ''
      };
    },
    error: (err: any) => {
      console.error('Profile error:', err);
    }
  });
}

  // ✅ FETCH PROFILE FROM BACKEND
  fetchProfile() {
    this.loading = true;

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.loading = false;

        // optional: store in localStorage
        localStorage.setItem('user', JSON.stringify(res));
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = 'Failed to load profile';
        console.error(err);
      }
    });
  }

  // ✅ START EDIT
  startEdit(section: string) {
    this.backupUser = JSON.parse(JSON.stringify(this.user));

    if (section === 'basic') this.editBasic = true;
    if (section === 'contact') this.editContact = true;
  }

  // ✅ SAVE PROFILE TO BACKEND
  saveProfile() {
    this.loading = true;

    const nameParts = (this.user.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone: this.user.mobile,
      dob: this.user.dob,
      gender: this.user.gender,
      address: this.user.address,
      emergency_contact: this.user.emergency
    };

    this.authService.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.user = {
          name: (res.first_name || '') + ' ' + (res.last_name || ''),
          email: res.email || '',
          mobile: res.phone || '',
          dob: res.dob || '',
          gender: res.gender || '',
          address: res.address || '',
          emergency: res.emergency_contact || ''
        };

        localStorage.setItem('user', JSON.stringify(res));

        this.editBasic = false;
        this.editContact = false;

        alert('Profile updated successfully!');
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = 'Update failed';
        console.error(err);
      }
    });
  }

  // ❌ CANCEL EDIT
  cancelEdit() {
    this.user = JSON.parse(JSON.stringify(this.backupUser));

    this.editBasic = false;
    this.editContact = false;
  }
}
