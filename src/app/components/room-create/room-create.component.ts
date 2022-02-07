import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { DialogService } from '../../dialogs/dialog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss']
})
export class RoomCreateComponent implements OnInit {
  room: Room;
  roomFormStatus: any;

  constructor(private router: Router,
              private roomService: RoomService,
              private dialogService: DialogService) {
    this.room = new Room();
  }

  ngOnInit(): void {
  }

  onRoomFormStatusChanged(newStatus: any) {
    this.roomFormStatus = newStatus;
  }

  onCreateRoom() {
    this.dialogService.openLoadingDialog('Creating room. Please wait...');
    this.roomService.create(this.room).subscribe(() => {
      this.dialogService.updateLoadingDialogData('Room created successfully', 'SUCCESS');
      this.dialogService.closeLoadingDialogAfterTimeout();
      this.router.navigate(['/room-list']);
    }, (error) => {
      this.dialogService.updateLoadingDialogData('Error creating room', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
    });
  }
}
