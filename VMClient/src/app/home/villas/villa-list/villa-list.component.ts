import { FilterComponent } from './filter/filter.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VillaService } from '../../../../services/villa.service';

@Component({
  selector: 'app-villa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterComponent, RouterModule],
  templateUrl: './villa-list.component.html',
  styleUrls: ['./villa-list.component.scss']
})
export class VillaListComponent implements OnInit, OnDestroy {

  villas: any[] = [];
  allVillas: any[] = [];   // master list for filtering
  activeFilters: any = null;  // track applied filters
  intervalId: any;   // for auto refresh

  constructor(private villaService: VillaService) {}

  ngOnInit(): void {
    this.loadVillas();

    // AUTO REFRESH EVERY 5 SECONDS
    this.intervalId = setInterval(() => {
      this.loadVillas();
    }, 5000);
  }

  // CLEANUP (IMPORTANT)
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ✅ LOAD VILLAS
  loadVillas() {
    this.villaService.getVillas().subscribe({
      next: (data: any) => {

        console.log("API RESPONSE:", data);

        const villasData = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : [];

        this.allVillas = villasData.map((villa: any) => {

          console.log("IMAGE VALUE:", villa.image);

          return {
            id: villa.id,
            title: villa.title,
            location: villa.location,
            guestCount: villa.guests,   // raw number for filtering
            guests: `Upto ${villa.guests} Guest`,
            price: villa.price,
            totalPrice: villa.price,
            selectedRoom: 'For 1 Room',
            rating: villa.rating,

            // ✅ IMAGE FIX
            image: villa.image
              ? (villa.image.startsWith('http')
                  ? villa.image
                  : `http://127.0.0.1:8000${villa.image}`)
              : null,

            // ✅ AMENITIES (frontend controlled)
            amenities: [
              { icon: 'bi bi-wifi', label: 'WiFi' },
              { icon: 'bi bi-water', label: 'Pool' },
              { icon: 'bi bi-snow', label: 'AC' },
              { icon: 'bi bi-tv', label: 'TV' },
              { icon: 'bi bi-triangle', label: 'Mountain'}
            ]
          };
        });

        // If a filter is active, re-apply it; otherwise show all
        if (this.activeFilters) {
          this.applyFilter(this.activeFilters);
        } else {
          this.villas = [...this.allVillas];
        }
        console.log("FINAL DATA:", this.villas);
      },

      error: (err: any) => {
        console.error("API ERROR:", err);
        this.villas = [];
      }
    });
  }

  // DELETE
  deleteVilla(id: number) {
    this.villaService.deleteVilla(id).subscribe({
      next: () => {
        this.loadVillas();
      },
      error: (err: any) => {
        console.error("DELETE ERROR:", err);
      }
    });
  }

  // ✅ ROOM OPTIONS
  roomOptions = [
    { label: 'For 1 Room', price: 5999 },
    { label: 'For 2 Rooms', price: 10999 },
    { label: 'For 3 Rooms', price: 15999 },
    { label: 'Entire Villa', price: 24999 }
  ];

  // ✅ UPDATE PRICE
  updatePrice(villa: any) {
    const selected = this.roomOptions.find(
      opt => opt.label === villa.selectedRoom
    );

    villa.totalPrice = selected?.price ?? villa.price;
  }

  // ✅ SORT
  sortVillas(event: any) {
    const value = event?.target?.value;

    if (value === 'priceLow') {
      this.villas.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    if (value === 'priceHigh') {
      this.villas.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    if (value === 'rating') {
      this.villas.sort((a, b) => b.rating - a.rating);
    }
  }

  // ✅ FILTER
  applyFilter(filters: any) {
    console.log("Filters applied:", filters);
    this.activeFilters = filters;  // save so auto-refresh respects it

    this.villas = this.allVillas.filter(villa => {

      // --- Location filter (skip if none selected) ---
      if (filters.locations?.length > 0) {
        const match = filters.locations.some((loc: string) =>
          villa.location?.toLowerCase().includes(loc.toLowerCase())
        );
        if (!match) return false;
      }

      // --- Price filter (only filter if price > 0 to avoid blocking everything) ---
      if (filters.price > 0 && villa.price > filters.price) return false;

      // --- Guests filter (only filter if guests > 1 to avoid blocking everything) ---
      if (filters.guests > 1 && villa.guestCount < filters.guests) return false;

      return true;
    });
  }
}
