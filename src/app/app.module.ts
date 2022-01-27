import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { logoutConfirmationDialog, NavBarComponent } from './nav-bar/nav-bar.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule, } from '@angular/material/dialog';
import { AllUsersComponent} from './all-users/all-users.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddResidentComponent } from './add-resident/add-resident.component';
import { UpdateResidentComponent } from './update-resident/update-resident.component';
import { ResidentInfoComponent } from './resident-info/resident-info.component';
import { ResidentDetailComponent } from './resident-detail/resident-detail.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { DeleteUserConfirmationDialog, saveChangesDialog, UserProfileComponent } from './user-profile/user-profile.component';
import { InputSurveyComponent } from './input-survey/input-survey.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthRouteGuard } from './share/services/guards/auth.route.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './share/services/guards/auth.interceptor';
import { HasRoleGuard } from './share/services/guards/has-role.guard';
import { environment } from 'src/environments/environment';
import { Authservice } from './share/services/auth.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCardModule} from '@angular/material/card';


//firebase
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { windowService } from './share/services/window.service';
import { confirmationDialog } from './share/confirmatonDialog';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { excelPreviewDialog } from './share/excel-preview-dialog';
import { uploadFileDialog } from './share/upload-file';



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
    UserProfileComponent,
    saveChangesDialog,
    DeleteUserConfirmationDialog,
    logoutConfirmationDialog,
    UpdateResidentComponent,
    ResidentInfoComponent,
    ResidentDetailComponent,
    confirmationDialog,
    EditEventsComponent,
    excelPreviewDialog,
    uploadFileDialog,
    InputSurveyComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
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
    MatProgressBarModule,
    MatTooltipModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    MatAutocompleteModule,
    CdkTableModule,
    MatCardModule,
  ],

  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
    HasRoleGuard,
    Authservice,
    AuthRouteGuard,
  windowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
