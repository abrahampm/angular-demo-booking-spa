import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Room, ROOM_TYPE_DESCRIPTION} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {DialogService} from '../../dialogs/dialog.service';
import {RoomListDataSource} from './room-list-data.source';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Room>;

  dataSource: RoomListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['number', 'type', 'capacity', 'status', 'edit-button', 'delete-button'];

  constructor(private roomService: RoomService,
              private dialogService: DialogService) {}

  ngOnInit() {
    this.dataSource = new RoomListDataSource(this.roomService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
  }

  onDeleteRoom(room: Room) {
    this.dialogService.openLoadingDialog('Deleting room. Please wait...');
    this.roomService.delete(room).subscribe(() => {
      this.dialogService.updateLoadingDialogData('Room deleted successfully', 'SUCCESS');
      this.dialogService.closeLoadingDialogAfterTimeout();
      this.dataSource.loadData();
    }, (error) => {
      this.dialogService.updateLoadingDialogData('Error deleting room', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
    });
  }

  getRoomTypeDescription(room: Room) {
    return ROOM_TYPE_DESCRIPTION[room.type];
  }
}
