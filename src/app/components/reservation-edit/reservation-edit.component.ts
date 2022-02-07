import { Component, OnInit } from '@angular/core';
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {DialogService} from '../../dialogs/dialog.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss']
})
export class ReservationEditComponent implements OnInit {
  reservation: Reservation;
  reservationFormStatus: any;
  reservationInformationLoaded = false;

  constructor(private reservationService: ReservationService,
              private router: Router,
              private dialogService: DialogService,
              private activatedRoute: ActivatedRoute) {
    this.reservation = new Reservation();
  }

  ngOnInit(): void {
    this.dialogService.openLoadingDialog('Getting reservation information. Please wait...');
    this.activatedRoute.params.subscribe((params) => {
      this.reservationService.get(params.id).subscribe((reservation) => {
        this.reservation = reservation;
        this.reservationInformationLoaded = true;
        this.dialogService.closeLoadingDialog();
      }, (error) => {
        this.dialogService.updateLoadingDialogData('Error getting reservation information', 'ERROR');
        this.dialogService.closeLoadingDialogAfterTimeout();
      });
    });
  }

  onReservationFormStatusChange(newStatus: any) {
    this.reservationFormStatus = newStatus;
  }

  onUpdateReservation() {
    this.dialogService.openLoadingDialog('Updating reservation. Please wait...');
    this.reservationService.update(this.reservation).subscribe(() => {
      this.dialogService.updateLoadingDialogData('Reservation updated successfully', 'SUCCESS');
      this.dialogService.closeLoadingDialogAfterTimeout();
      this.router.navigate(['/reservation-list']);
    }, (e) => {
      if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
        this.dialogService.updateLoadingDialogData(e.error.message, 'ERROR');
      } else {
        this.dialogService.updateLoadingDialogData('Error updating reservation', 'ERROR');
      }
      this.dialogService.closeLoadingDialogAfterTimeout();
    });

  }
}
