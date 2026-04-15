import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillaListComponent } from './villa-list.component';

describe('VillaListComponent', () => {
  let component: VillaListComponent;
  let fixture: ComponentFixture<VillaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
