import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { OTPComponent } from './otp/otp.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:"", component: HomeComponent , pathMatch: "full"},
{path:"register", component: RegisterComponent},
{path:"forgetpassword", component: ForgetPasswordComponent},
{path:"otp", component: OTPComponent},
{path:"deleteaccount", component: DeleteAccountComponent},
{path:"**", component: PageNotFoundComponent ,  pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
