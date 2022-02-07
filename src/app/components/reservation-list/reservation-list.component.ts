import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ReservationListDataSource } from './reservation-list-datasource';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Reservation } from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {DialogService} from '../../dialogs/dialog.service';
import {AuthService} from '../../auth/auth.service';
import {Room, ROOM_TYPE_DESCRIPTION} from '../../models/room.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Reservation>;

  dataSource: ReservationListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['start-date', 'end-date', 'room-number', 'room-type', 'edit-button', 'cancel-button'];

  constructor(private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private dialogService: DialogService,
              private authService: AuthService,
              private reservationService: ReservationService) {
    matIconRegistry.addSvgIcon('sort', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sort.svg'));
  }

  ngOnInit() {
    this.dataSource = new ReservationListDataSource(this.reservationService);
    this.authService.isAdmin().subscribe(() => {
      this.displayedColumns.splice(4, 0, 'reservation-user');
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
  }

  onFilterByChange(value: string) {
    if (value.endsWith('_desc')) {
      this.sort.direction = 'desc';
      this.sort.active = value.substring(0, value.length - 5);
    } else {
      this.sort.direction = 'asc';
      this.sort.active = value.substring(0, value.length - 4);
    }
    this.paginator.pageIndex = 0;
    this.dataSource.loadData();
  }

  onDeleteReservation(reservation: Reservation) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.dialogService.openLoadingDialog('Canceling reservation. Please wait...');
      this.reservationService.delete(reservation).subscribe(() => {
        this.dialogService.updateLoadingDialogData('Reservation successfully cancelled', 'SUCCESS');
        this.dialogService.closeLoadingDialogAfterTimeout();
        this.dataSource.loadData();
      }, (e) => {
        if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
          this.dialogService.updateLoadingDialogData(e.error.message, 'ERROR');
        } else {
          this.dialogService.updateLoadingDialogData('Error cancelling reservation', 'ERROR');
        }
        this.dialogService.closeLoadingDialogAfterTimeout();
      });
    }
  }

  getRoomTypeDescription(room: Room) {
    return ROOM_TYPE_DESCRIPTION[room.type];
  }
}
