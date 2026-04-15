import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VillaSummaryService } from '../../../../../services/villas/villa-summary.service';
import { VillaService } from '../../../../../services/villas/villa.service';

@Component({
  selector: 'app-villa-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './villa-summary.component.html',
  styleUrl: './villa-summary.component.scss'
})
export class VillaSummaryComponent implements OnInit {

  // DATA
  villa: any = null;

  // UI STATES
  isLoading = false;
  isBooked = false;
  errorMessage = '';

  // MEALS
  breakfastCount = 1;
  lunchCount = 1;
  dinnerCount = 1;

  // BOOKING DETAILS
  checkIn = '2025-08-22';
  checkOut = '2025-08-24';
  guests = 2;

  // TRANSPORT
  transportOptions = [
    { name: 'Sedan', price: 2999, persons: '4 Person' },
    { name: 'Innova', price: 2999, persons: '6 Person' },
    { name: 'Winger', price: 2999, persons: '9 Person' },
    { name: 'Tempo Traveller', price: 2999, persons: '13+ Person' }
  ];

  selectedTransport: any = null;

  constructor(
    private route: ActivatedRoute,
    private villaService: VillaService,
    private summaryService: VillaSummaryService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid villa ID';
      return;
    }

    this.villaService.getVillaById(+id).subscribe({
      next: (data: any) => {
        this.villa = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load villa';
      }
    });
  }

  updateMeal(type: 'breakfast' | 'lunch' | 'dinner', delta: number) {
    if (type === 'breakfast') this.breakfastCount = Math.max(0, this.breakfastCount + delta);
    if (type === 'lunch') this.lunchCount = Math.max(0, this.lunchCount + delta);
    if (type === 'dinner') this.dinnerCount = Math.max(0, this.dinnerCount + delta);
  }

  selectTransport(option: any) {
    this.selectedTransport = option;
  }

  getTotalPrice(): number {
    if (!this.villa) return 0;

    const base = this.villa.price;

    const meals =
      (this.breakfastCount * 2999) +
      (this.lunchCount * 2999) +
      (this.dinnerCount * 2999);

    const transport = this.selectedTransport?.price || 0;

    return base + meals + transport;
  }

  // 🔥 MAIN BOOK FUNCTION
  bookNow() {

    if (!this.villa) return;

    this.isLoading = true;
    this.errorMessage = '';

    // ✅ ONLY SEND VALID FIELDS (IMPORTANT)
    const bookingData = {
      villa: this.villa.id,
      name: "Guest User",
      check_in: this.checkIn,
      check_out: this.checkOut,
      guests: this.guests
    };

    this.summaryService.createBooking(bookingData).subscribe({

      next: (res: any) => {

        console.log("BOOKING SUCCESS:", res);

        this.summaryService.makePayment({
          booking_id: res.id
        }).subscribe({

          next: () => {
             console.log("PAYMENT SUCCESS");
            this.isBooked = true;
            this.isLoading = false;
          },

          error: (err: any) => {
            console.error("PAYMENT ERROR:", err);
            this.isLoading = false;
            this.errorMessage = 'Payment failed';
          }

        });

      },

      error: (err: any) => {
        console.error("BOOKING ERROR:", err);
        this.isLoading = false;
        this.errorMessage = 'Booking failed';
      }

    });
  }
}
