import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAvailabilityComponent } from './reservation-availability.component';

describe('ReservationAvailabilityComponent', () => {
  let component: ReservationAvailabilityComponent;
  let fixture: ComponentFixture<ReservationAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
