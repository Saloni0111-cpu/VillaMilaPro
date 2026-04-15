import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {

  balance = 0;
  giftCode = '';

  validGiftCards: { [key: string]: number } = {
    '8UR4HT6': 500,
    'WELCOME100': 100,
    'BONUS50': 50
  };

  addGiftCard(): void {

    const code = this.giftCode.trim().toUpperCase();

    if (!code) {
      alert('Please enter a gift card code');
      return;
    }

    if (this.validGiftCards[code]) {

      const amount = this.validGiftCards[code];

      this.balance += amount;

      alert(`₹${amount} added successfully!`);

      delete this.validGiftCards[code];

      this.giftCode = '';

    } else {
      alert('Invalid or already used gift card');
    }
  }
}