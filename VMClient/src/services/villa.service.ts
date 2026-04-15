import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VillaService {
  // ✅ GET SINGLE VILLA BY ID
  getVillaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/`);
  }

  private baseUrl = 'http://localhost:8000/api/villas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // ✅ GET ALL VILLAS
  getVillas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/`);
  }

  // ✅ GET SAVED VILLAS
  getSavedVillas(): Observable<any[]> {
    const token = this.authService.getToken();
    console.log('Fetching saved villas with token:', token ? 'Token exists' : 'Token MISSING');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/saved/`, { headers });
  }

  // ✅ TOGGLE SAVE VILLA
  toggleSaveVilla(villaId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.baseUrl}/save/`, { villa_id: villaId }, { headers });
  }

  // ✅ DELETE VILLA
  deleteVilla(villaId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.baseUrl}/${villaId}/`, { headers });
  }
}
