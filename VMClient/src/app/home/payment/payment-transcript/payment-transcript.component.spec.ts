import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTranscriptComponent } from './payment-transcript.component';

describe('PaymentTranscriptComponent', () => {
  let component: PaymentTranscriptComponent;
  let fixture: ComponentFixture<PaymentTranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTranscriptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
