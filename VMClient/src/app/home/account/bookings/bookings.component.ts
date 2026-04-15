import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../blogs/services/booking/booking.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  bookings: any[] = [];
  isLoading: boolean = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  // Load real booking data from backend API
  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.isLoading = false;
      }
    });
  }

  // Share booking button
  shareBookings(booking: any): void {
    alert(`Sharing booking:\n${booking.villa_details?.name || 'Villa'}`);
  }

  // Calculate nights
  getNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 1;
  }
}
