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
import { FormsModule  , ReactiveFormsModule , } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { AllUsersComponent } from './all-users/all-users.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddResidentComponent } from './add-resident/add-resident.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { DeleteUserDialogComponent } from './dialog/delete-user-dialog/delete-user-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PasswordVarificationDialogComponent } from './dialog/password-varification-dialog/password-varification-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    PageNotFoundComponent,
    NavBarComponent,
    ForgetPasswordComponent,
    AllUsersComponent,
    AddResidentComponent,
    EventsPageComponent,
    DeleteUserDialogComponent,
    UserProfileComponent,
    PasswordVarificationDialogComponent
,
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
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,

  ],
  entryComponents :[DeleteUserDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
