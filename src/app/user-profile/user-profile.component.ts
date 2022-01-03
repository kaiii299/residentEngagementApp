import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import {userDataInterface} from 'src/app/share/services/Users'

export interface DialogData {
  password: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  deleteConfirmation: string
  passwordConfirmation = ""

  hide = true
  message = "";
  dateTime: any
  currentUserType: any
  currentUsername: string

  newEmail: any
  newUserName: any
  newFirstName: any
  newPassword: any
  newGender: any
  newBlockNumber: any
  newRoleValue: any
  newCommitteeValue: any
  newStatus: any
  newPhoneNumber: string;

  user : any;

  userTypesArrays: string[] = [
    "Admin",
    "CC staff",
    "Key Ccc",
    "RN Manager",
    "Key RN Manager",
    "Normal RN Manager"
  ]

  committeeArrays: string[] = [
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

  constructor(public dialog: MatDialog, public authService: Authservice) { }

  ngOnInit(): void {
    var uid = localStorage.getItem("uid")
    this.authService.getUserById(uid).subscribe(res => {
      this.user = res
      this.newRoleValue = this.user.role
      this.newUserName = this.user.userName
      console.log(res)
    })
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserConfirmationDialog, {
      width: '250px',
      data: { delete: this.deleteConfirmation },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deleteConfirmation = result;
    })
  }

  edit() {
    const obj: userDataInterface = {
      username: this.newUserName,
      email: this.user.email,
      firstName: this.user.firstName,
      gender: this.user.gender,
      phoneNumber: this.user.phoneNumber,
      Role: this.newRoleValue,
      committee: this.user.committee,
      blockNumber: this.user.blockNumber,
    }
    console.log(obj)
  }

  confirmPassword() {
    const passwordDialogRef = this.dialog.open(passwordVarificationDialog, {
      width: '250px',
      data: { password: this.passwordConfirmation },
    });
    passwordDialogRef.afterClosed().subscribe(result => {
      this.passwordConfirmation = result;
      if (result == "Password") {
        this.hide = false
      }
    })
  }
}

@Component({
  selector: "password-varification-dialog",
  templateUrl: './passwordVarification-dialog.html'
})
export class passwordVarificationDialog {
  passwordConfirmation: any
  message = ""

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>, private authService: Authservice) {
    dialogRef.disableClose = true;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmPassword(passwordConfirmationFromHtml: any) {
    if (passwordConfirmationFromHtml == "Password") {
      this.dialogRef.close(passwordConfirmationFromHtml)
    }
    else {
      this.message = "Wrong password.Try Again"
    }
  }
}

@Component({
  selector: "delete-user-confirmation-dialog",
  templateUrl: './deleteUser-dialog.html'
})
export class DeleteUserConfirmationDialog {
  deleteConfirmation = ''
  message = ""
  text: any

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>) {
    dialogRef.disableClose = true;

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.deleteConfirmation == "DELETE") {
      alert("account deleted")
      this.dialogRef.close()
    }
    else {
      this.message = "Try again"
      this.deleteConfirmation = ''
    }
  }


}

