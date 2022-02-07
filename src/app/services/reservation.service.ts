import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {API_URL} from '../app.settings';
import {Reservation} from '../models/reservation.model';
import {map} from 'rxjs/operators';
import {Room} from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  reservation$: BehaviorSubject<Reservation>;

  constructor(private http: HttpClient) {
    this.reservation$ = new BehaviorSubject<Reservation>(null);
  }


  public get(id: number): Observable<Reservation> {
    return this.http.get(API_URL + '/reservation/' + id.toString()).pipe(
      map((reservation: Reservation) => reservation)
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
    return this.http.get(API_URL + '/reservation', { params }).pipe(
      map((paginatedResult: any) => paginatedResult)
    );
  }

  public create(reservation: Reservation): Observable<void> {
    return this.http.post(API_URL + '/reservation', reservation).pipe(
      map(() => {})
    );
  }

  public update(reservation: Reservation): Observable<void> {
    return this.http.put(API_URL + '/reservation/' + reservation.id.toString(), reservation).pipe(
      map(() => {})
    );
  }

  public delete(reservation: Reservation): Observable<void> {
    return this.http.delete(API_URL + '/reservation/' + reservation.id.toString()).pipe(
      map(() => {})
    );
  }

  public availability(startDate: string, endDate: string): Observable<Room[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get(API_URL + '/reservation/availability', { params }).pipe(
      map((rooms: any) => rooms)
    );
  }

  public getMinStartDate(): Date {
    const minStartDate = new Date();
    minStartDate.setHours(0);
    minStartDate.setDate(minStartDate.getDate() + 1);
    return minStartDate;
  }

  public getMaxStartDate(): Date {
    const maxStartDate = new Date();
    maxStartDate.setHours(0);
    maxStartDate.setDate(maxStartDate.getDate() + 30);
    return maxStartDate;
  }

  public getMaxDaysDuration(): number {
    return 3;
  }

}
