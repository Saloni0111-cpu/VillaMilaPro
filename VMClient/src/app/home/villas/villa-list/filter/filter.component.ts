import { Component,EventEmitter,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterData {
  locations: string[];
  distances: number[];
  price: number;
  rooms: number;
  guests: number;
}


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
@Output() filterChanged = new EventEmitter<FilterData>();

  // ---------- DATA ----------

  locations = ['Lonavala', 'Manali', 'Alibaug', 'Ooty', 'Kairat'];
  selectedLocations: string[] = [];

  distanceOptions = [5, 10, 15, 20];
  selectedDistances: number[] = [];

  price = 100000;   // default = max so all villas show
  rooms = 1;
  guests = 1;   // default = 1 so no villas are blocked by guests filter

  // ---------- LOCATION ----------

  toggleLocation(city: string) {
    const i = this.selectedLocations.indexOf(city);

    i > -1
      ? this.selectedLocations.splice(i, 1)
      : this.selectedLocations.push(city);
  }

  // ---------- DISTANCE ----------

  toggleDistance(km: number) {
    const i = this.selectedDistances.indexOf(km);

    i > -1
      ? this.selectedDistances.splice(i, 1)
      : this.selectedDistances.push(km);
  }

  // ---------- COUNTERS ----------

  changeRooms(step: number) {
    this.rooms = Math.max(1, this.rooms + step);
  }

  changeGuests(step: number) {
    this.guests = Math.max(1, this.guests + step);
  }

  // ---------- RESET ----------

 resetFilters() {

  this.selectedLocations = [];
  this.selectedDistances = [];

  this.price = 100000;  // reset to max
  this.rooms = 1;
  this.guests = 1;

  // emit reset so villa list shows all villas again
  this.filterChanged.emit({
    locations: [],
    distances: [],
    price: 100000,
    rooms: 1,
    guests: 1
  });
}

  // ---------- APPLY ----------

  applyFilters() {

    const filters: FilterData = {
      locations: this.selectedLocations,
      distances: this.selectedDistances,
      price: this.price,
      rooms: this.rooms,
      guests: this.guests
    };

    this.filterChanged.emit(filters);

    // close bootstrap modal
    const modal = document.getElementById('filterModal');
    const bsModal = (window as any)?.bootstrap?.Modal?.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }

    // Force remove backdrops and reset body (Fix for "light black" screen issue)
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 300);
  }

}