import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { confirmationDialog } from '../share/confirmatonDialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { userService } from '../share/services/user.service';
import { RequestNewUserService } from '../share/services/request-new-user.service';
import Swal from 'sweetalert2';
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
  userDataArray = Array();
  userNameArray = Array();
  userEmailArray = Array();
  isExistUserName: any;
  isExistEmail: any;
  isOwn: any = true;
  newEmail: any;
  oldUserName: any;
  newUserName: string;
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
  requestStatus: any;
  userTypesArrays = Constants.roles;
  blockNumbersArray = Constants.blkNum;
  zonesInfo = Constants.zones;
  committeeArrays = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];
  getUser: Observable<any>;
  filterdBlockNumbers: Observable<string[]>;

  eventcbIsExistUserName = new EventEmitter<any>();
  eventcbIsExistUserName$ = this.eventcbIsExistUserName.asObservable();

  eventcbIsExistEmail = new EventEmitter<any>();
  eventcbIsExistEmail$ = this.eventcbIsExistEmail.asObservable();

  allowDeleteUser = Constants.allowDeleteUser;
  _uid = this.activatedRoute.snapshot.queryParams.id;
  uid = localStorage.getItem('uid');
  _role: any;

  constructor(
    public requestService: RequestNewUserService,
    public userService: userService,
    public dialog: MatDialog,
    public authService: Authservice,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    if (this.uid != this._uid) {
      this.isOwn = null;
    }

    const decryptedUid = this.authService.decryptData(this._uid);
    await this.userService
      .getUserById(decryptedUid)
      .toPromise()
      .then((data) => {
        this.user = data.userData;
        this.oldUserName = this.user.userName;
        this.newUserName = this.user.userName;
        this.newFirstName = this.user.firstName;
        this.newGender = this.user.gender;
        this.newEmail = this.user.email;
        this.newPhoneNumber = this.user.phoneNumber;
        this.newRoleValue = this.user.role;
        this.newCommitteeValue = this.user.committee;
        this.newBlockNumber = this.user.blockNumber;
        this.requestStatus = this.user.requestStatus;
      });

    this.updateUserForm = this._formBuilder.group({
      usernameCtrl: ['', Validators.required],
      emailCtrl: ['', Validators.required],
      genderCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required],
      phoneNumberCtrl: ['', Validators.required],
      roleCtrl: ['', Validators.required],
      committeeCtrl: ['', Validators.required],
      blockNumberCtrl: ['', Validators.required],
    });

    const _role = localStorage.getItem('role');
    this._role = this.authService.decryptData(_role);
  }

  checkUserExist() {
    this.authService.getAllUsers();
    this.authService.eventcbUserData$.subscribe((data) => {
      this.userDataArray = data;
      this.userDataArray.forEach((_userData) => {
        this.userNameArray.push(_userData.data.userName);
        this.userEmailArray.push(_userData.data.email);
      });
      if (this.userNameArray.includes(this.newUserName)) {
        //checks if username exists
        this.isExistUserName = true;
        this.eventcbIsExistUserName.emit(this.isExistUserName);
      } else {
        this.isExistUserName = false;
        this.eventcbIsExistUserName.emit(this.isExistUserName);
      }
      const emptyArr = Array();
      this.userNameArray = emptyArr;
    });
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

    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
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
    LastUpdatedTime = new Date().toLocaleTimeString()
  ) {
    this.dialog.open(saveChangesDialog, {
      data: {
        isUpdate: true,
        message: 'Update',
        userName,
        email,
        firstName,
        gender,
        phoneNumber,
        role,
        committee,
        blockNumber,
        LastUpdatedDate,
        LastUpdatedTime,
      },
    });
  }

  openAcceptDialog(
    userName = this.newUserName,
    email = this.newEmail,
    firstName = this.newFirstName,
    gender = this.newGender,
    phoneNumber = this.newPhoneNumber,
    role = this.newRoleValue,
    committee = this.newCommitteeValue,
    blockNumber = this.newBlockNumber,
    LastUpdatedDate = new Date().toLocaleDateString(),
    LastUpdatedTime = new Date().toLocaleTimeString()
  ) {
    this.dialog.open(saveChangesDialog, {
      data: {
        isAccept: true,
        isUpdate: null,
        message: 'Accept',
        userName,
        email,
        firstName,
        gender,
        phoneNumber,
        role,
        blockNumber,
        committee,
        LastUpdatedDate,
        LastUpdatedTime,
      },
    });
  }

  openRejectDialog() {
    this.dialog.open(saveChangesDialog, {
      data: {
        isAccept: false,
        isUpdate: null,
        message: 'Reject',
      },
    });
  }

  goBack() {
    this.authService.goback();
  }
}

@Component({
  selector: 'password-varification-dialog',
  templateUrl: './saveChangesDialog.html',
})
export class saveChangesDialog {
  message = '';
  isAccept: any;
  isUpdate: any | null;
  uid = localStorage.getItem('uid');
  _uid = this.activatedRoute.snapshot.queryParams.id;
  decryptedParamsId: any;
  decryptedLcId: any;
  _data: any;
  isRequest = this.activatedRoute.snapshot.queryParams.request;

  constructor(
    public requestService: RequestNewUserService,
    public userService: userService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public authService: Authservice,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    dialogRef.disableClose = true;
    this._data = data;
    this.message = this._data.message;
    this.isAccept = this._data.isAccept;
    this.isUpdate = this._data.isUpdate;
    delete this._data.isUpdate;
    delete this._data.message;
    this.decryptedParamsId = this.authService.decryptData(this._uid);
    this.decryptedLcId = this.authService.decryptData(this.uid);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    console.log(this._data);
    this.userService
      .updateUserData(this.decryptedParamsId, this._data)
      .then(() => {
        if (this.decryptedLcId == this.decryptedParamsId) {
          // check its current logged in person
          this.authService.eventCallbackuserName.next(this._data.userName); //update lc and navbar
          const encrypt = this.authService.encryptData(this._data.userName);
          localStorage.setItem('username', encrypt);
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User profile updated',
          showConfirmButton: true,
        }).then((result)=>{
          if(result.isConfirmed){
            setTimeout(() => {
              location.reload(), 80000;
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        this.dialogRef.close();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed to update user profile',
          showConfirmButton: false,
          timer: 1000,
        });
      });
    this.dialogRef.close();
  }

  accept() {
    this._data.requestStatus = "Accepted";
    this.userService.updateUserData(this.decryptedParamsId, this._data).then(()=>{
      this.dialogRef.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'User accepted',
        showConfirmButton: false,
        timer: 1000,
      });
    }).catch((err)=>{
      this.dialogRef.close();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Error accepting user, ${this._data.requestStatus}`,
        showConfirmButton: true,
      });
    })
  }

  reject() {
    this._data.requestStatus = "Rejected";
    this.userService.updateUserData(this.decryptedParamsId, this._data).then(()=>{
      this.dialogRef.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'User Rejected',
        showConfirmButton: false,
        timer: 1000,
      });
    }).catch((err)=>{
      this.dialogRef.close();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error rejecting user',
        showConfirmButton: true,
      });
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

  constructor(
    private userService: userService,
    private authService: Authservice,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    dialogRef.disableClose = true;
  }

  uid = this.activatedRoute.snapshot.queryParams.id;
  _uid = this.authService.decryptData(this.uid);

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.deleteConfirmation == 'DELETE') {
      this.userService.deleteUserbyId(this._uid);
      this.dialog.open(confirmationDialog, {
        data: {
          message: 'User deleted',
        },
      });
      this.dialogRef.close();
      this.authService.goback();
    } else {
      this.message = 'Try again';
      this.deleteConfirmation = '';
    }
  }
}
