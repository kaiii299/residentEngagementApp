import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddResidentComponent } from './add-resident/add-resident.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UpdateResidentComponent } from './update-resident/update-resident.component';
import { ResidentInfoComponent } from './resident-info/resident-info.component';

const routes: Routes = [
  {path:"", component: HomeComponent , pathMatch: "full"},
{path:"register", component: RegisterComponent},
{path:"forgetpassword", component: ForgetPasswordComponent},
{path:"allusers", component: AllUsersComponent},
{path:"addresident", component: AddResidentComponent},
{path:"myprofile", component: UserProfileComponent},
  {path: "updateresident", component: UpdateResidentComponent },
  {path: "residentinfo", component: ResidentInfoComponent},
{path:"**", component: PageNotFoundComponent ,  pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
