import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VillaSummaryService {

  private API_URL = `${environment.apiUrl}/bookings/`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ CREATE BOOKING
  createBooking(data: any): Observable<any> {
    return this.http.post(this.API_URL, data, { headers: this.getHeaders() });
  }

  // ✅ PAYMENT
  makePayment(data: any) {
    return this.http.post(`${this.API_URL}pay/`, data, { headers: this.getHeaders() });
  }
}