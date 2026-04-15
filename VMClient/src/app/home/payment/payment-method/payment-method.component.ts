import { Component } from '@angular/core';
import { PaymentTranscriptComponent } from "../payment-transcript/payment-transcript.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, PaymentTranscriptComponent],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent {
  paymentType: 'full' | 'partial' = 'partial';

  selectPayment(type: 'full' | 'partial') {
    this.paymentType = type;
  }
}
