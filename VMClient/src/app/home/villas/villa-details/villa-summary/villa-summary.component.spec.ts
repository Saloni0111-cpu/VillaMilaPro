import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillaSummaryComponent } from './villa-summary.component';

describe('VillaSummaryComponent', () => {
  let component: VillaSummaryComponent;
  let fixture: ComponentFixture<VillaSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillaSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
