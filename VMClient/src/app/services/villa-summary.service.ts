import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VillaSummaryService {

  private API_URL = 'http://localhost:8000/api/bookings/';

  constructor(private http: HttpClient) {}

  // ✅ CREATE BOOKING
  createBooking(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // ✅ PAYMENT
  makePayment(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}pay/`, data);
  }
}