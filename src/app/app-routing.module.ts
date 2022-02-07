import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { RoomEditComponent } from './admin/components/room-edit/room-edit.component';
import { RoomCreateComponent } from './admin/components/room-create/room-create.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { AuthGuard } from './auth/auth.guard';
import {RoomListComponent} from './admin/components/room-list/room-list.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ReservationAvailabilityComponent} from './components/reservation-availability/reservation-availability.component';
import {AdminGuard} from './auth/admin.guard';


const routes: Routes = [
  {path: '', redirectTo: 'reservation-start', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'reservation-start', component: ReservationAvailabilityComponent},

  {path: 'reservation-list', component: ReservationListComponent, canActivate: [AuthGuard]},
  {path: 'place-reservation', component: ReservationCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit-reservation/:id', component: ReservationEditComponent, canActivate: [AuthGuard]},

  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard], canLoad: [AdminGuard]},

  {path: '**', redirectTo: 'reservation-start'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
