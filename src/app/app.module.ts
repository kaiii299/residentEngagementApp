import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule} from '@angular/material/core';
import { OTPComponent } from './otp/otp.component';
import { FormsModule  , ReactiveFormsModule  } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { AddResidentComponent } from './add-resident/add-resident.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    PageNotFoundComponent,
    NavBarComponent,
    ForgetPasswordComponent,
    OTPComponent,
    DeleteAccountComponent,
    AddResidentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,


  ],
  entryComponents :[DeleteAccountComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
