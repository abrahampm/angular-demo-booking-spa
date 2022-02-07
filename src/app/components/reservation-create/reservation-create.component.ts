import { Component, OnInit } from '@angular/core';
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {DialogService} from '../../services/dialog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reservation-create',
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.scss']
})
export class ReservationCreateComponent implements OnInit {
  reservation: Reservation;
  reservationFormStatus: any;
  roomFormStatus: any;

  constructor(private reservationService: ReservationService,
              private dialogService: DialogService,
              private router: Router) {
    this.reservation = new Reservation();
  }

  ngOnInit(): void {
    this.reservationService.reservation$.subscribe((reservation) => {
      if (reservation) {
        this.reservation = reservation;
      }
    });
  }

  onReservationFormStatusChange(newStatus: any) {
    this.reservationFormStatus = newStatus;
  }

  onCreateReservation() {
    if (this.reservationFormStatus === 'VALID') {
      this.dialogService.openLoadingDialog('Creating reservation. Please wait...');
      this.reservationService.create(this.reservation).subscribe(() => {
        this.dialogService.updateLoadingDialogData('Reservation created successfully', 'SUCCESS');
        this.dialogService.closeLoadingDialogAfterTimeout();
        this.reservationService.reservation$.next(null);
        this.router.navigate(['/reservation-list']);
      }, (e) => {
        if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
          this.dialogService.updateLoadingDialogData(e.error.message, 'ERROR');
        } else {
          this.dialogService.updateLoadingDialogData('Error creating reservation', 'ERROR');
        }
        this.dialogService.closeLoadingDialogAfterTimeout();
      });
    }
  }

}
