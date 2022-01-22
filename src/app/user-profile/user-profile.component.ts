import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { confirmationDialog } from '../share/confirmatonDialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  uid: any;
  user: any;
  userObj: any
  hasChange = false;
  userTypesArrays = Constants.roles;
  blockNumbersArray = Constants.blkNum;
  zonesInfo = Constants.zones;
  committeeArrays = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];

  myControl = new FormControl("", [autocompleteStringValidator(this.availableBlocks), Validators.required]);

  filterdBlockNumbers: Observable<string[]>;

  _uid = this.activatedRoute.snapshot.queryParams.id;
  _role = localStorage.getItem("role")

  constructor(public dialog: MatDialog,
    public authService: Authservice,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    var decryptedUid = this.authService.decryptData(this._uid)
    this.authService.getUserByIdParam(decryptedUid).subscribe(data => {
      this.user = data;
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
      usernameCtrl: ['', Validators.required,],
      emailCtrl: ['', Validators.required, Validators.email],
      genderCtrl: ['', Validators.required,],
      firstNameCtrl: ['', Validators.required,],
      phoneNumberCtrl: ['', Validators.required,],
      roleCtrl: ['', Validators.required,],
      committeeCtrl: ['', Validators.required,],
      blockNumberCtrl: ["", [autocompleteStringValidator(this.availableBlocks), Validators.required]]
    });

    this.filterdBlockNumbers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(event => this._filter(event)),
    );


    const _role = localStorage.getItem("role");
    this._role = this.authService.decryptData(_role);
  }

  onChange(event: any) {
    this.newCommitteeValue = event;
    console.log(this.newCommitteeValue);
    this.availableBlocks = this.zonesInfo.get(this.newCommitteeValue);
    console.log(this.zonesInfo.get(this.newCommitteeValue));
  }

  _filter(event: string): string[] {
    if (event === '') {
      return this.availableBlocks.slice()
    }
    const filterValue = event.toLowerCase()
    return this.availableBlocks.filter((option: string) => option.toLowerCase().includes(filterValue))
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
    LastUpdatedTime = new Date().toLocaleTimeString(),
  ) {
    this.dialog.open(saveChangesDialog, {
      data: {
        userName,
        email, firstName, gender, phoneNumber, role, committee, blockNumber, LastUpdatedDate, LastUpdatedTime
      }
    })
    const encrypt = this.authService.encryptData(this.newUserName)
    this.authService.eventCallbackuserName.next(this.newUserName)
    localStorage.setItem("username", encrypt)
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
    var decryptData = this.authService.decryptData(_uid);
    this.authService.updateUserDataByQuery(this.data, decryptData)
    this.dialog.open(confirmationDialog, {
      data: {
        message: "User profile updated",
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
    } else {
      this.message = 'Try again';
      this.deleteConfirmation = '';
    }
  }
}


