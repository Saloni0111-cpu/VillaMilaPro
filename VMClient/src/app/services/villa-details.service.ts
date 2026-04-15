import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VillaService {

  private API_URL = 'http://localhost:8000/api/villas/';

  constructor(private http: HttpClient) {}

  // ✅ GET ALL VILLAS
  getVillas(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // ✅ GET SINGLE VILLA (DETAIL PAGE)
  getVillaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}${id}/`);
  }

  // ✅ CREATE VILLA (optional)
  createVilla(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // ✅ DELETE VILLA (optional)
  deleteVilla(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}${id}/`);
  }
}