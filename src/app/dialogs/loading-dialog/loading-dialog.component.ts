import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent implements OnInit {
  status = 'LOADING';
  text = 'Loading...'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/success.svg'));
    matIconRegistry.addSvgIcon('error', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg'));
    matIconRegistry.addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info.svg'));
  }

  ngOnInit(): void {
    this.data.dataSubject.subscribe((data) => {
      this.text = data.text;
      this.status = data.status;
    });
  }

}
