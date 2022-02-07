import { Component, OnInit } from '@angular/core';
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {Room, ROOM_TYPE_DESCRIPTION} from '../../models/room.model';
import {Observable, Subject} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {DialogService} from '../../dialogs/dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reservation-availability',
  templateUrl: './reservation-availability.component.html',
  styleUrls: ['./reservation-availability.component.scss']
})
export class ReservationAvailabilityComponent implements OnInit {
  reservation: Reservation;
  minDate: Date;
  maxDate: Date;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  availableRooms: Subject<Room[]>;

  constructor(private reservationService: ReservationService,
              private dialogService: DialogService,
              private router: Router) {
    this.minDate = reservationService.getMinStartDate();
    this.maxDate = reservationService.getMaxStartDate();
    this.availableRooms = new Subject<Room[]>();
  }

  ngOnInit(): void {
  }

  getRoomTypeDescription(room: Room) {
    return ROOM_TYPE_DESCRIPTION[room.type];
  }

  onAvailabilityCheck() {
    if (this.dateRange.invalid) {
      this.dialogService.openLoadingDialog('Please select the check in and check out dates and try again', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
      return;
    }
    const startDate = this.dateRange.value.start.toISOString();
    const endDate = this.dateRange.value.end.toISOString();
    this.reservationService.availability(startDate, endDate).subscribe(
      (rooms) => {
        if (rooms.length === 0) {
          this.dialogService.openLoadingDialog('There are not rooms available in that dates. Please try again.', 'ERROR');
          this.dialogService.closeLoadingDialogAfterTimeout();
        }
        this.availableRooms.next(rooms);
      }, (e) => {
        if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
          this.dialogService.openLoadingDialog(e.error.message, 'ERROR');
        } else {
          this.dialogService.openLoadingDialog('Network or server error occurred. Please try again.', 'ERROR');
        }
        this.dialogService.closeLoadingDialogAfterTimeout();
      }
    );
  }

  onPlaceReservation(room: Room) {
    const reservation = new Reservation();
    reservation.startDate = this.dateRange.value.start;
    reservation.endDate = this.dateRange.value.end;
    reservation.room = room;
    this.reservationService.reservation$.next(reservation);
    this.router.navigate(['/place-reservation']);
  }
}
