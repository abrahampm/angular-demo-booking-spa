// @angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

// Header components imports
import { PageHeaderComponent } from './shared/page-header/page-header.component';

// Reservation components imports
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { ReservationService } from './services/reservation.service';

// Flex layout import
import { FlexLayoutModule } from '@angular/flex-layout';

// Material modules imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

// Rich text editor CKEditor module import
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Auxiliary component and service to show dialog when performing server requests
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { DialogService } from './services/dialog.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {AuthService} from './auth/auth.service';
import { ReservationAvailabilityComponent } from './components/reservation-availability/reservation-availability.component';
import {MatCardModule} from '@angular/material/card';
import {AuthInterceptor, DEFAULT_TIMEOUT} from './auth/auth.interceptor';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ReservationListComponent,
    ReservationCreateComponent,
    ReservationEditComponent,
    ReservationFormComponent,
    LoginComponent,
    LoadingDialogComponent,
    RegisterComponent,
    ReservationAvailabilityComponent,
  ],
  imports: [
    // Angular modules
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    // Material modules
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    // Rich text editor module
    CKEditorModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  // No entry component declaration needed since Angular 9.0.0,
  // Therefore there is not need to add LoadingDialogComponent to entryComponents array
  providers: [
    AuthService,
    DialogService,
    ReservationService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 60000}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
