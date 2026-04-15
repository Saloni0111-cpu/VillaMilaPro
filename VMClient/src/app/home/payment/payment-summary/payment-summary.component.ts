import { Component } from '@angular/core';
import { PaymentTranscriptComponent } from '../payment-transcript/payment-transcript.component';
import { CommonModule } from '@angular/common';

interface MealOption {
  key: 'breakfast' | 'lunch' | 'dinner';
  label: string;
  price: number;
  count: number;
}

interface TransportOption {
  label: string;
  capacity: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [CommonModule, PaymentTranscriptComponent],
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent {

  meals: MealOption[] = [
    { key: 'breakfast', label: 'Breakfast', price: 2999, count: 1 },
    { key: 'lunch', label: 'Lunch', price: 2999, count: 1 },
    { key: 'dinner', label: 'Dinner', price: 2999, count: 1 }
  ];

  transports: TransportOption[] = [
    { label: 'Sedan', capacity: '4 Person', price: 2999, selected: false },
    { label: 'Innova', capacity: '6 Person', price: 2999, selected: true },
    { label: 'Winger', capacity: '9 Person', price: 2999, selected: false },
    { label: 'Tempo Traveller', capacity: '13+ Person', price: 2999, selected: false }
  ];

  increment(meal: MealOption) {
    meal.count++;
  }

  decrement(meal: MealOption) {
    if (meal.count > 0) meal.count--;
  }

  selectTransport(option: TransportOption) {
    this.transports.forEach(t => t.selected = false);
    option.selected = true;
  }
}