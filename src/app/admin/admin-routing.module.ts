import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomEditComponent } from './components/room-edit/room-edit.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { RoomListComponent } from './components/room-list/room-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'room-list', pathMatch: 'full'},
  {path: 'create-room', component: RoomCreateComponent},
  {path: 'edit-room/:id', component: RoomEditComponent},
  {path: 'room-list', component: RoomListComponent},
  {path: '**', redirectTo: 'room-list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
