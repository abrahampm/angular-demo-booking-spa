import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationUser} from '../../models/application-user.model';
import {NgForm} from '@angular/forms';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {DialogService} from '../../dialogs/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  applicationUser: ApplicationUser;
  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private dialogService: DialogService,
              private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/person.svg'));
    this.applicationUser = new ApplicationUser();
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user !== null) {
        this.router.navigate(['/']);
      }
    });
  }

  get continueRouterUrl() {
    return this.activatedRoute.snapshot.queryParamMap.get('continue') ?? '/';
  }

  navigateToRegister() {
    this.router.navigate(['/register'], {
      queryParams: {continue: this.continueRouterUrl},
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.dialogService.openLoadingDialog('Please check the information provided and try again', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
      return;
    }

    this.dialogService.openLoadingDialog('Logging in. Please wait...');
    this.authService.login(this.applicationUser.email, this.applicationUser.password).subscribe((result) => {
      if (result.status === 'Success') {
        this.activatedRoute.queryParamMap.subscribe((params) => {
          this.dialogService.closeLoadingDialog();
          const continueRoute = params.get('continue') ?? '/';
          this.router.navigate([continueRoute]);
        });
      } else {
        this.dialogService.updateLoadingDialogData('Login failed. Please check and try again' , 'ERROR');
        this.dialogService.closeLoadingDialogAfterTimeout();
      }
    }, (e) => {
      if (e?.error.hasOwnProperty('status') && e.error.status === 'Error') {
        this.dialogService.updateLoadingDialogData(e.error.message , 'ERROR');
      } else {
        this.dialogService.updateLoadingDialogData('Network or server error occurred. Please try again.' , 'ERROR');
      }
      this.dialogService.closeLoadingDialogAfterTimeout();
    });
  }

}
