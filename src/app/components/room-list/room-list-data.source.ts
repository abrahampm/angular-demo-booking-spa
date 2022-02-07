import { DataSource } from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of, merge} from 'rxjs';
import {Room} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {catchError, finalize, tap} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';


/**
 * Data source for the RoomList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RoomListDataSource extends DataSource<Room> {
  private dataSubject = new BehaviorSubject<Room[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading = this.loadingSubject.asObservable();
  public paginator: MatPaginator;
  public sort: MatSort;

  constructor(private roomService: RoomService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Room[]> {
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
    this.roomService.list(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(result => {
      this.dataSubject.next(result?.data);
      if (!this.paginator.length) {
        this.paginator.length = result?.pagination?.total;
      }
    });
  }


}
