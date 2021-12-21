import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteUserDialogComponent } from '../dialog/delete-user-dialog/delete-user-dialog.component';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { PasswordVarificationDialogComponent } from '../dialog/password-varification-dialog/password-varification-dialog.component';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  deleteConfirmation: string
  passwordConfirmation: string

  hide = true
  message = "";
  dateTime = "";
  currentUserType = 'CCC'
  currentUsername = 'Tom'

  oldEmail = ""
  oldUserName = "Tom";
  oldFirstName = "";
  oldPassword = "";
  oldGender = "";
  oldBlockNumber = "";
  oldUserTypeValue = "Bussin";
  oldCommitteesValue = "";
  oldStatus = "";

  newEmail = ""
  newUserName = "";
  newFirstName = "";
  newPassword = "";
  newGender = "";
  newBlockNumber = "";
  newUserTypeValue = "";
  newCommitteesValue = "";
  newStatus = "";

  userTypesArrays: string[] = [
    "Admin",
    "CC staff",
    "Key Ccc",
    "RN Manager",
    "Key RN Manager",
    "Normal RN Manager"
  ]

  committeesArrays: string[] = [
    "Taman Jurong Zone A RN",
    "Taman Jurong Zone B RC",
    "Taman Jurong Zone C RN",
    "Taman Jurong Zone D RC",
    "Taman Jurong Zone E RC",
    "Taman Jurong Zone F RC",
    "Taman Jurong Zone G RN",
    "9 @ Yuan Ching NC",
    "Caspian NC",
    "Lakefront Residences NC",
    "Lakeholmz Condo NC",
    "Lakelife RN",
    "Lakepoint Condo NC",
    "Lakeside Grove NC",
  ]



  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '250px',
      data: { delete: this.deleteConfirmation },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deleteConfirmation = result;
    })
  }

  edit() {

  }

  confirmPassword() {
    const passwordDialogRef = this.dialog.open(PasswordVarificationDialogComponent, {
      width: '250px',
      data: { delete: this.oldPassword },
    });
    passwordDialogRef.afterClosed().subscribe(result => {
      this.passwordConfirmation = result;
      this.hide = false;
    })
  }

}
