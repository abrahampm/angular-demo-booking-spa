import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }

}
