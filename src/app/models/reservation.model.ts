import {Room} from './room.model';

export class Reservation {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  room: Room;

  constructor(startDate = null, endDate = null, description = '', room = null) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.room = room ?? new Room();
  }
}
