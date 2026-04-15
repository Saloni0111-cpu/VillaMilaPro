import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: 'app-payment-transcript',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-transcript.component.html',
  styleUrls: ['./payment-transcript.component.scss']
})
export class PaymentTranscriptComponent {

  rentalCharges = 56000;
  chefCharges = 2000;
  gst = 2000;
  coupon = 1000;

  couponCode = 'DRHGTJ';
  couponMax = 3000;

  acceptedTerms = false;

  get totalPayable(): number {
    return this.rentalCharges + this.chefCharges + this.gst - this.coupon;
  }
}