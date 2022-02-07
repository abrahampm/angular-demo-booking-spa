import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_URL} from '../../app.settings';
import {Room} from '../../models/room.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  public get(id: number): Observable<Room> {
    return this.http.get(API_URL + '/room/' + id.toString()).pipe(
      map((room: Room) => room)
    );
  }

  public list(pageNumber= 1, pageSize= 5,
              sortColumn?: string, sortDirection?: string): Observable<any> {
    let params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());
    if (sortColumn && sortDirection) {
      params = params.set('sortBy', sortColumn + '_' + sortDirection);
    }
    return this.http.get(API_URL + '/room', { params }).pipe(
      map((paginatedResult: any) => paginatedResult)
    );
  }

  public create(room: Room): Observable<void> {
    return this.http.post(API_URL + '/room', room).pipe(
      map(() => {})
    );
  }

  public update(room: Room): Observable<void> {
    return this.http.put(API_URL + '/room/' + room.id.toString(), room).pipe(
      map(() => {})
    );
  }

  public delete(room: Room): Observable<void> {
    return this.http.delete(API_URL + '/room/' + room.id.toString()).pipe(
      map(() => {})
    );
  }
}
