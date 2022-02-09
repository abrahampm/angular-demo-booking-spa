import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSidenavToggle() {
    this.sidenavToggle.emit();
  }
}
