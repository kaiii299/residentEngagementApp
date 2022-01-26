import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { confirmationDialog } from '../share/confirmatonDialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';

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
  updateUserForm: FormGroup;
  hide = true;
  message = '';
  dateTime: any;
  currentUserType: any;
  currentUsername: string;

  newEmail: any;
  oldUserName: any;
  newUserName = "";
  newFirstName: any;
  newPassword: any;
  newGender: any;
  newBlockNumber: any;
  newRoleValue: any;
  oldRoleValue: any;
  newCommitteeValue: any;
  newStatus: any;
  newPhoneNumber: string;
  user: any;
  userObj: any
  hasChange = false;
  userTypesArrays = Constants.roles;
  blockNumbersArray = Constants.blkNum;
  zonesInfo = Constants.zones;
  committeeArrays = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];
  getUser: Observable<any>
  filterdBlockNumbers: Observable<string[]>;

  _uid = this.activatedRoute.snapshot.queryParams.id;
  uid = localStorage.getItem("uid")
  _role = localStorage.getItem("role")

  constructor(public dialog: MatDialog,
    public authService: Authservice,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder) { }

  async ngOnInit() {
    const decryptedUid = this.authService.decryptData(this._uid)
    await this.authService.getUserById(decryptedUid).toPromise().then((data) => {
      //console.log(data);
      this.user = data.userData
      this.oldUserName = this.user.userName;
      this.newUserName = this.user.userName;
      this.newFirstName = this.user.firstName;
      this.newGender = this.user.gender;
      this.newEmail = this.user.email;
      this.newPhoneNumber = this.user.phoneNumber;
      this.newRoleValue = this.user.role;
      this.newCommitteeValue = this.user.committee;
      this.newBlockNumber = this.user.blockNumber;
    })

    this.updateUserForm = this._formBuilder.group({
      usernameCtrl: ['', Validators.required],
      emailCtrl: ['', Validators.required],
      genderCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required,],
      phoneNumberCtrl: ['', Validators.required,],
      roleCtrl: ['', Validators.required],
      committeeCtrl: ['', Validators.required],
      blockNumberCtrl: ['', Validators.required],
    });

    const _role = localStorage.getItem("role");
    this._role = this.authService.decryptData(_role);
  }

  onChange(event: any) {
    this.newCommitteeValue = event;
    this.availableBlocks = this.zonesInfo.get(this.newCommitteeValue);
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteUserConfirmationDialog, {
      width: '250px',
      data: { delete: this.deleteConfirmation },
    });

    dialogRef.afterClosed().toPromise().then((result) => {
      this.deleteConfirmation = result;
      console.log(result);
    });
  }

  openEditDialog(
    userName = this.newUserName,
    email = this.newEmail,
    firstName = this.newFirstName,
    gender = this.newGender,
    phoneNumber = this.newPhoneNumber,
    role = this.newRoleValue,
    committee = this.newCommitteeValue,
    blockNumber = this.newBlockNumber,
    LastUpdatedDate = new Date().toLocaleDateString(),
    LastUpdatedTime = new Date().toLocaleTimeString(),
  ) {
    this.dialog.open(saveChangesDialog, {
      data: {
        userName,
        email, firstName, gender, phoneNumber, role, committee, blockNumber, LastUpdatedDate, LastUpdatedTime,
      }
    })
    if (this.newEmail != this.user.email) {
      alert("Email has been changed");
    }
  }

  goBack() {
    this.authService.goback()
  }
}

@Component({
  selector: 'password-varification-dialog',
  templateUrl: './saveChangesDialog.html',
})
export class saveChangesDialog {
  message = '';
  uid = localStorage.getItem("uid")
  _uid = this.activatedRoute.snapshot.queryParams.id;
  _data: any;

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>, public authService: Authservice,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private activatedRoute: ActivatedRoute
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    this.dialogRef.close();
    var decryptData = this.authService.decryptData(this._uid);
    this.authService.updateUserData(decryptData, this.data).then(() => {
      this._data = this.data;
      const uid = this.authService.decryptData(this.uid);
      const _uid = this.authService.decryptData(this._uid);

      if (uid == _uid) {
        this.authService.eventCallbackuserName.next(this._data.userName);
        const encrypt = this.authService.encryptData(this._data.userName);
        localStorage.setItem("username", encrypt)
      }
      this.dialog.open(confirmationDialog, {
        data: {
          message: "User profile updated",
          reload: true
        }
      })
    }).catch((err) => {
      console.log(err);
      this.dialog.open(confirmationDialog, {
        data: {
          message: "Failed to update user profile",
        }
      })
    })
  }
}

@Component({
  selector: 'delete-user-confirmation-dialog',
  templateUrl: './deleteUser-dialog.html',
})
export class DeleteUserConfirmationDialog {
  deleteConfirmation = '';
  message = '';
  reload = true;

  text: any;

  constructor(private authService: Authservice, public dialogRef: MatDialogRef<UserProfileComponent>, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
    dialogRef.disableClose = true;
  }

  uid = this.activatedRoute.snapshot.queryParams.id;
  _uid = this.authService.decryptData(this.uid);

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.deleteConfirmation == 'DELETE') {
      this.authService.deleteUserbyId(this._uid);
      this.dialog.open(confirmationDialog, {
        data: {
          message: "User deleted"
        }
      })
      this.dialogRef.close();
      this.authService.goback();
    } else {
      this.message = 'Try again';
      this.deleteConfirmation = '';
    }
  }
}


