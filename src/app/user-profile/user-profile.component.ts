import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import { userDataInterface } from 'src/app/share/services/Users';
import { Constants } from '../constants';
import { confirmationDialog } from '../share/confirmatonDialog';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn { //validatorFn returns validation errors else null
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null
    }
    return { 'invalidAutocompleteString': { value: control.value } }
  }
}
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
  hasChange = false;
  userTypesArrays = Constants.roles;
  blockNumbersArray = Constants.blkNum;
  committeeArrays = Constants.committees;
  myControl = new FormControl("",[autocompleteStringValidator(this.blockNumbersArray),Validators.required]);
  filterdBlockNumbers: Observable<string[]>;
  _uid = this.activatedRoute.snapshot.queryParams.id;
  _role = localStorage.getItem("role")

  constructor(public dialog: MatDialog,
     public authService: Authservice,
      private activatedRoute: ActivatedRoute,
      private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (!this._uid) {
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
    else if (this._uid) {
      console.log(this._uid);
      this.authService.getUserByIdParam(this._uid).subscribe(res => {
        this.user = res;
        this.newUserName = this.user.userName;
        this.newFirstName = this.user.firstName;
        this.newGender = this.user.gender;
        this.newEmail = this.user.email;
        this.newPhoneNumber = this.user.phoneNumber;
        this.newRoleValue = this.user.role;
        this.newCommitteeValue = this.user.committee;
        this.newBlockNumber = this.user.blockNumber;
      })
    }
    this.updateUserForm = this._formBuilder.group({
      usernameCtrl: ['', Validators.required,],
      emailCtrl: ['', Validators.required,Validators.email],
      genderCtrl: ['', Validators.required,],
      firstNameCtrl: ['', Validators.required,],
      phoneNumberCtrl: ['', Validators.required,],
      roleCtrl: ['', Validators.required,],
      committeeCtrl: ['', Validators.required,],
      //blockNumberCtrl : ['', Validators.required,],
      blockNumberCtrl : ["",[autocompleteStringValidator(this.blockNumbersArray),Validators.required]]
    });

    this.filterdBlockNumbers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    const _role = localStorage.getItem("role");
    this._role = this.authService.decryptData(_role);
  }

  _filter(value: string): string[] {
    if (value === '') {
      return this.blockNumbersArray.slice()
    }
    const filterValue = value.toLowerCase()
    return this.blockNumbersArray.filter(option => option.toLowerCase().includes(filterValue))
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
    userName = this.newUserName,
    email = this.newEmail,
    firstName = this.newFirstName,
    gender = this.newGender,
    phoneNumber = this.newPhoneNumber,
    role = this.newRoleValue,
    committee = this.newCommitteeValue,
    blockNumber = this.newBlockNumber,
    LastUpdatedDate = new Date().toLocaleDateString(),
    LastUpdtedTime = new Date().toLocaleTimeString(),
  ) {
    this.dialog.open(saveChangesDialog, {
      data: {
        userName,
        email, firstName, gender, phoneNumber, role, committee, blockNumber, LastUpdatedDate, LastUpdtedTime
      }
    })
    var encrypt = this.authService.encryptData(this.newUserName)
    if (!this._uid) {
      localStorage.setItem("username", encrypt)
    }
  }
  goBack(){
    this.authService.goback()
  }
}

@Component({
  selector: 'password-varification-dialog',
  templateUrl: './saveChangesDialog.html',
})
export class saveChangesDialog {
  message = '';
  uid: any
  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>, public authService: Authservice,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private activatedRoute: ActivatedRoute
  ) {
    dialogRef.disableClose = true;
    var encryptedUid = localStorage.getItem('uid');
    this.uid = this.authService.decryptData(encryptedUid);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    console.log(this.data);
    this.dialogRef.close();
    var _uid = this.activatedRoute.snapshot.queryParams.id;
    if (!_uid) {
      this.authService.updateUserData(this.data)
    }
    else if (_uid) {
      this.authService.updateUserDataByQuery(this.data, _uid)
    }
    this.dialog.open(confirmationDialog, {
      data: {
        message: "User profile updated"
      }
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
  text: any;

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>, private dialog: MatDialog) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.deleteConfirmation == 'DELETE') {
      this.dialog.open(confirmationDialog, {
        data: {
          message: "User deleted"
        }
      })
      this.dialogRef.close();
    } else {
      this.message = 'Try again';
      this.deleteConfirmation = '';
    }
  }
}
