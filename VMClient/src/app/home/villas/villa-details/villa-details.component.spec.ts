import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillaDetailsComponent } from './villa-details.component';

describe('VillaDetailsComponent', () => {
  let component: VillaDetailsComponent;
  let fixture: ComponentFixture<VillaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillaDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
