import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { Reservation } from '../../models/reservation.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ReservationService} from '../../services/reservation.service';
import {Room, ROOM_TYPE_DESCRIPTION} from '../../models/room.model';
import {BehaviorSubject} from 'rxjs';
import {DialogService} from '../../services/dialog.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit, OnChanges {
  @Input('disabled') disabled: boolean;
  @Input() reservation: Reservation;
  @Output() reservationChange = new EventEmitter<Reservation>();
  @Output() formStatusChange = new EventEmitter<any>();

  Editor = ClassicEditor;
  EditorConfig = {
    placeholder: 'Do you have any special request?',
  };

  minDate: Date;
  maxDate: Date;
  reservationForm = new UntypedFormGroup({
    startDate: new UntypedFormControl(),
    endDate: new UntypedFormControl(),
    roomSelect: new UntypedFormControl()
  });

  availableRooms: BehaviorSubject<Room[]>;

  constructor(private reservationService: ReservationService,
              private dialogService: DialogService) {
    this.minDate = reservationService.getMinStartDate();
    this.maxDate = reservationService.getMaxStartDate();
    this.availableRooms = new BehaviorSubject<Room[]>([]);
  }

  ngOnInit(): void {
    this.reservationForm.controls.endDate.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.checkRoomAvailability();
    });

    this.reservationForm.statusChanges.pipe(debounceTime(500)).subscribe((status) => {
      this.formStatusChange.emit(status);
    });

    this.reservationForm.controls.roomSelect.valueChanges.subscribe((event) => {
      this.onRoomChange(event);
    });
  }

  ngOnChanges(): void {
    if (this.reservation.startDate && this.reservation.endDate) {
      this.reservationForm.setValue({
        startDate: this.reservation.startDate,
        endDate: this.reservation.endDate,
        roomSelect: this.reservation.room
      });
    }
  }

  getRoomTypeDescription(room: Room) {
    return ROOM_TYPE_DESCRIPTION[room.type];
  }

  checkRoomAvailability() {
    const startDate = this.reservationForm.value.startDate;
    const endDate = this.reservationForm.value.endDate;
    console.log(startDate, endDate);
    if (startDate && endDate) {
      this.dialogService.openLoadingDialog('Checking room availability');
      this.reservation.startDate = startDate.toISOString().split('T')[0];
      this.reservation.endDate = endDate.toISOString().split('T')[0];
      this.reservationChange.emit(this.reservation);
      this.reservationService.availability(this.reservation.startDate, this.reservation.endDate).subscribe(
        (rooms) => {
          if (rooms.length === 0) {
            if (this.reservation.room?.id) {
              this.availableRooms.next([this.reservation.room]);
              this.dialogService.closeLoadingDialog();
            } else {
              this.dialogService.updateLoadingDialogData('There are not rooms available in that dates. Please try again.', 'ERROR');
              this.dialogService.closeLoadingDialogAfterTimeout();
            }
          } else {
            if (this.reservation.room?.id) {
              if (!rooms.find(r => r.id === this.reservation.room.id)) {
                rooms.push(this.reservation.room);
              }
            }
            this.availableRooms.next(rooms);
            this.dialogService.closeLoadingDialog();
          }

        }, (e) => {
          if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
            this.dialogService.updateLoadingDialogData(e.error.message, 'ERROR');
          } else {
            this.dialogService.updateLoadingDialogData('Network or server error occurred. Please try again.', 'ERROR');
          }
          this.dialogService.closeLoadingDialogAfterTimeout();
        }
      );
    }


  }

  onRoomChange(room: Room) {
    this.reservation.room = room;
    this.reservationChange.emit(this.reservation);
  }

  compareRoomObjects(object1: Room, object2: Room) {
    return object1 && object2 && object1.id === object2.id;
  }
}
