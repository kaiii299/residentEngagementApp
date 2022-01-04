import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import { userDataInterface } from 'src/app/share/services/Users';

export interface DialogData {
  password: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  deleteConfirmation: string;
  passwordConfirmation = '';

  hide = true;
  message = '';
  dateTime: any;
  currentUserType: any;
  currentUsername: string;

  newEmail: any;
  newUserName: any;
  newFirstName: any;
  newPassword: any;
  newGender: any;
  newBlockNumber: any;
  newRoleValue: any;
  oldRoleValue: any;
  newCommitteeValue: any;
  newStatus: any;
  newPhoneNumber: string;
  uid: any;
  user: any;
  userObj: any

  userTypesArrays: string[] = [
    'Admin',
    'CC staff',
    'Key Ccc',
    'RN Manager',
    'Key RN Manager',
    'Normal RN Manager',
  ];

  committeeArrays: string[] = [
    'Taman Jurong Zone A RN',
    'Taman Jurong Zone B RC',
    'Taman Jurong Zone C RN',
    'Taman Jurong Zone D RC',
    'Taman Jurong Zone E RC',
    'Taman Jurong Zone F RC',
    'Taman Jurong Zone G RN',
    '9 @ Yuan Ching NC',
    'Caspian NC',
    'Lakefront Residences NC',
    'Lakeholmz Condo NC',
    'Lakelife RN',
    'Lakepoint Condo NC',
    'Lakeside Grove NC',
  ];

  constructor(public dialog: MatDialog, public authService: Authservice) {}

  ngOnInit(): void {
    var encryptedUid = localStorage.getItem('uid');
    this.uid = this.authService.decryptData(encryptedUid);
    this.authService.getUserById(this.uid).subscribe((res) => {
      this.user = res;
      this.newUserName = this.user.userName;
      this.newFirstName = this.user.firstName;
      this.newGender = this.user.gender;
      this.newEmail = this.user.email;
      this.newPhoneNumber = this.user.phoneNumber;
      this.newRoleValue = this.user.role;
      this.newCommitteeValue = this.user.committee;
      this.newBlockNumber = this.user.blockNumber;
    });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserConfirmationDialog, {
      width: '250px',
      data: { delete: this.deleteConfirmation },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.deleteConfirmation = result;
    });
  }

  openEditDialog(
    userName$ = this.newUserName,
    email$ = this.newEmail,
    firstName$ = this.newFirstName ,
    gender$ = this.newGender ,
    phoneNumber$ = this.newPhoneNumber ,
    Role$ = this.newRoleValue ,
    committee$ = this.newCommitteeValue ,
    blockNumber$ = this.newBlockNumber
  ) {
    this.dialog.open(saveChangesDialog,{
      data:{userName$,
        email$, firstName$, gender$, phoneNumber$, Role$, committee$, blockNumber$
      }
    })
  }
}

@Component({
  selector: 'password-varification-dialog',
  templateUrl: './saveChangesDialog.html',
})
export class saveChangesDialog {
  message = '';

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update(){
    console.log(this.data);
    this.dialogRef.close();
    //alert('updated profile');
  }
}

@Component({
  selector: 'delete-user-confirmation-dialog',
  templateUrl: './deleteUser-dialog.html',
})
export class DeleteUserConfirmationDialog {
  deleteConfirmation = '';
  message = '';
  text: any;

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.deleteConfirmation == 'DELETE') {
      alert('account deleted');
      this.dialogRef.close();
    } else {
      this.message = 'Try again';
      this.deleteConfirmation = '';
    }
  }
}
