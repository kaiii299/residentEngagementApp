import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddResidentComponent } from './add-resident/add-resident.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthRouteGuard } from './share/services/guards/auth.route.guard';
import { HasRoleGuard } from './share/services/guards/has-role.guard';
import { UpdateResidentComponent } from './update-resident/update-resident.component';
import { ResidentInfoComponent } from './resident-info/resident-info.component';
import { ResidentDetailComponent } from './resident-detail/resident-detail.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { ListComponent } from './list/list.component';
import { RequestComponent } from './request/request.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, //login
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  {
    path: 'createnewuser',
    component: RegisterComponent,
    canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'requestaccount',
    component: RequestComponent,
    //data: { role: 'Admin' },
  },
  {
    path: 'allusers',
    component: AllUsersComponent,
    canActivate: [AuthRouteGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'addresident',
    component: AddResidentComponent,
    canActivate: [AuthRouteGuard],
    // data: { role: 'Admin' },
  },
  {
    path: 'events',
    component: EventsPageComponent,
    //canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'list',
    component: ListComponent,
    //canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [AuthRouteGuard],
    //data: { role: 'Admin' },
  },
  { path: 'updateresident', component: UpdateResidentComponent },
  {
    path: 'residentinfo',
    component: ResidentInfoComponent ,
    canActivate: [AuthRouteGuard],
  },
  { path: "residentdetail", component: ResidentDetailComponent},
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
