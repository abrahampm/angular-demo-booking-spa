export class Room {
  id: number;
  number: string;
  type: string;
  capacity: number;
  status: string;

  // tslint:disable-next-line:variable-name
  constructor(number = '', type = '', capacity = 1, status = '') {
    this.number = number;
    this.type = type;
    this.capacity = capacity;
    this.status = status;
  }
}

export const ROOM_TYPE_DESCRIPTION = {
  1: 'Junior Suite Room',
  2: 'Standard Double or Twin Room',
  3: 'King Room',
};
