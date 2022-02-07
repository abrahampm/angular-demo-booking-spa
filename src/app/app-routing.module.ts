import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { RoomEditComponent } from './components/room-edit/room-edit.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { AuthGuard } from './auth/auth.guard';
import {RoomListComponent} from './components/room-list/room-list.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ReservationAvailabilityComponent} from './components/reservation-availability/reservation-availability.component';


const routes: Routes = [
  {path: '', redirectTo: 'reservation-start', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reservation-start', component: ReservationAvailabilityComponent},
  {path: 'reservation-list', component: ReservationListComponent, canActivate: [AuthGuard]},
  {path: 'place-reservation', component: ReservationCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit-reservation/:id', component: ReservationEditComponent, canActivate: [AuthGuard]},
  {path: 'create-room', component: RoomCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit-room/:id', component: RoomEditComponent, canActivate: [AuthGuard]},
  {path: 'room-list', component: RoomListComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'reservation-start'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
