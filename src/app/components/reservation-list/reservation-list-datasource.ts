import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Observable, merge, BehaviorSubject, of} from 'rxjs';
import {Reservation} from "../../models/reservation.model";
import {ReservationService} from "../../services/reservation.service";


/**
 * Data source for the ReservationList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ReservationListDataSource extends DataSource<Reservation> {
  private dataSubject = new BehaviorSubject<Reservation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading = this.loadingSubject.asObservable();
  public paginator: MatPaginator;
  public sort: MatSort;

  constructor(private reservationService: ReservationService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Reservation[]> {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadData()),
    ).subscribe();

    return this.dataSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData() {
    this.loadingSubject.next(true);
    this.reservationService.list(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(result => {
      this.dataSubject.next(result?.data)
      if (!this.paginator.length) {
        this.paginator.length = result?.pagination?.total;
      }
    });
  }
}
