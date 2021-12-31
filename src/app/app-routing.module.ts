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

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, //login
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  {
    path: 'register',
    component: RegisterComponent,
    //canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'allusers',
    component: AllUsersComponent,
    //canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'addresident',
    component: AddResidentComponent,
    //canActivate: [AuthRouteGuard, HasRoleGuard],
    //data: { role: 'Admin' },
  },
  {
    path: 'myprofile',
    component: UserProfileComponent,
    //canActivate: [AuthRouteGuard],
    //data: { role: 'Admin' },
  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
