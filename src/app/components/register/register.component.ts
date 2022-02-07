import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApplicationUser} from '../../models/application-user.model';
import {AuthService} from '../../auth/auth.service';
import {DialogService} from '../../services/dialog.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  applicationUser: ApplicationUser;
  @ViewChild('registerForm') registerForm: NgForm;
  minDate: Date;
  maxDate: Date;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private dialogService: DialogService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 18, 0, 1);
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

  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: {continue: this.continueRouterUrl},
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.dialogService.openLoadingDialog('Please check the information provided and try again', 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      this.dialogService.openLoadingDialog('Passwords don\'t match. Please check and try again' , 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
      return;
    }

    if (!/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(this.registerForm.value.password)) {
      this.dialogService.openLoadingDialog('Passwords must contain at least 6 characters, including numbers and letters' , 'ERROR');
      this.dialogService.closeLoadingDialogAfterTimeout();
      return;
    }

    this.dialogService.openLoadingDialog('Registering. Please wait...');
    this.authService.register(this.applicationUser).subscribe((registerResult) => {
      if (registerResult.status === 'Success') {
        this.dialogService.updateLoadingDialogData('Logging in. Please wait...', 'LOADING');
        this.authService.login(this.applicationUser.email, this.applicationUser.password).subscribe((loginResult) => {
          if (loginResult.status === 'Success') {
            this.router.navigate([this.continueRouterUrl]);
          } else {
            this.navigateToLogin();
          }
          this.dialogService.closeLoadingDialog();
        }, (error) => {
          this.dialogService.closeLoadingDialog();
          this.navigateToLogin();
        });
      } else {
        this.dialogService.updateLoadingDialogData('Registering failed. Please check your information and try again.' , 'ERROR');
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
