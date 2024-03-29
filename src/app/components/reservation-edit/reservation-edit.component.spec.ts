import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationEditComponent } from './reservation-edit.component';

describe('ReservationCreateComponent', () => {
  let component: ReservationEditComponent;
  let fixture: ComponentFixture<ReservationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
