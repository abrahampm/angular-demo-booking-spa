import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../components/loading-dialog/loading-dialog.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  loadingDialogRef: MatDialogRef<any>;
  loadingDialogData: BehaviorSubject<any>;

  constructor(private dialog: MatDialog) {
    this.loadingDialogData = new BehaviorSubject<any>(null);
    this.loadingDialogData.subscribe();
  }

  openLoadingDialog(text= 'Loading', status = 'LOADING') {
    this.loadingDialogData.next({text, status});
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      data: {dataSubject: this.loadingDialogData},
      disableClose: true,
    });
  }

  updateLoadingDialogData(text: string, status: string) {
    this.loadingDialogData.next({text, status});
  }

  closeLoadingDialog() {
    this.loadingDialogRef.close();
  }

  closeLoadingDialogAfterTimeout(timeout= 3000) {
    setTimeout(() => {
      this.closeLoadingDialog();
    }, timeout);
  }
}
