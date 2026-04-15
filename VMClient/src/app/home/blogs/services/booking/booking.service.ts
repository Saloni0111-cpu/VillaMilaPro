import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = `${environment.apiUrl}/bookings/`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // POST /api/bookings/ — creates a booking (auth required)
  createBooking(data: {
    villa: number;
    name: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: number;
  }) {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  // GET /api/bookings/ — list MY bookings (auth required)
  getBookings() {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  // POST /api/bookings/pay/ — process payment
  makePayment(data: { booking_id: number; payment_id: string }) {
    return this.http.post(`${this.baseUrl}pay/`, data, { headers: this.getHeaders() });
  }
}
