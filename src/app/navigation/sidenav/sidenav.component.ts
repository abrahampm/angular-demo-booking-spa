import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSidenavClose() {
    this.sidenavClose.emit();
  }
}
