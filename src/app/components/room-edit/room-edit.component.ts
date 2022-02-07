import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {DialogService} from '../../dialogs/dialog.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit {
  room: Room;
  roomFormStatus: any;
  roomInformationLoaded = false;

  constructor(private router: Router,
              private roomService: RoomService,
              private dialogService: DialogService,
              private activatedRoute: ActivatedRoute) {
    this.room = new Room();
  }

  ngOnInit(): void {
    this.dialogService.openLoadingDialog('Getting room information. Please wait...');
    this.activatedRoute.params.subscribe((params) => {
      this.roomService.get(params.id).subscribe((room) => {
        this.room = room;
        this.roomInformationLoaded = true;
        this.dialogService.closeLoadingDialog();
      }, (error) => {
        this.dialogService.updateLoadingDialogData('Error getting room information', 'ERROR');
        this.dialogService.closeLoadingDialogAfterTimeout();
      });
    });
  }

  onRoomFormStatusChanged(newStatus: any) {
    this.roomFormStatus = newStatus;
  }

  onUpdateRoom() {
    this.dialogService.openLoadingDialog('Updating room. Please wait...');
    this.roomService.update(this.room).subscribe(() => {
      this.dialogService.updateLoadingDialogData('Room updated successfully', 'SUCCESS');
      this.dialogService.closeLoadingDialogAfterTimeout();
      this.router.navigate(['/room-list']);
    }, (error) => {
      this.dialogService.updateLoadingDialogData('Error updating room', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
    });
  }

}
