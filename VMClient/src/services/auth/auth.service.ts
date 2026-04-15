import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000/api';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // ✅ CHECK TOKEN
  private hasToken(): boolean {
    return !!localStorage.getItem('access');
  }

  // ✅ AUTH STATUS OBSERVABLE
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  // ✅ REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }

  // ✅ LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }

  // ✅ SAVE AUTH
  saveAuth(res: any) {
    if (res.access) localStorage.setItem('access', res.access);
    if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
    this.authStatus.next(true);
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('user');
    // also clear any other keys if needed, but not everything to avoid losing other settings
    this.authStatus.next(false);
  }

  // ✅ PROFILE
  getProfile() {
    return this.http.get(`${this.baseUrl}/profile/`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/`, data);
  }

  //GetToken

  getToken(): string | null {
  return localStorage.getItem('access');
}
//Logged in
 isLoggedIn(): boolean {
  return !!localStorage.getItem('access');
}
  // 🔥 FORGOT PASSWORD FLOW

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp/`, { email, otp });
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp/`, { email });
  }

  setPassword(email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/set-password/`, {
      email,
      password,
      confirm_password: confirmPassword
    });
  }
}
