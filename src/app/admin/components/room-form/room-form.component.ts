import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {Room, ROOM_TYPE_DESCRIPTION} from '../../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit, AfterViewInit {
  @Input('disabled') disabled: boolean;
  @Input() room: Room;
  @Output() roomChange = new EventEmitter<Room>();
  @Output() formStatusChange = new EventEmitter<any>();
  @ViewChild('roomForm') roomForm: NgForm;

  constructor(private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private roomService: RoomService) {
    matIconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/people.svg'));
    matIconRegistry.addSvgIcon('call', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/call.svg'));
    matIconRegistry.addSvgIcon('globe', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/globe.svg'));
    this.room = new Room();
    this.disabled = false;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.roomForm.valueChanges.subscribe(() => {
      this.roomChange.emit(this.room);
    });
    this.roomForm.statusChanges.subscribe((status) => {
      this.formStatusChange.emit(status);
    });
  }

  getRoomTypeDescription(roomType: number) {
    return ROOM_TYPE_DESCRIPTION[roomType];
  }
}
