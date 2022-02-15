import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { userDataInterface } from 'src/app/share/services/Users';
import { Constants } from '../constants';
import { Authservice } from '../share/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { excelPreviewDialog } from '../share/excel-preview-dialog';
import { uploadFileDialog } from '../share/upload-file';
import { HttpClient } from '@angular/common/http';
import { userService } from '../share/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AllUsersComponent implements AfterViewInit, OnInit {
  columnsToDisplay = Array();
  expandedElement: null;
  committees = Constants.committees;
  roles = Constants.roles;
  status = Constants.status;
  blockNumber = Constants.blkNum;
  variables = Constants.variables;
  requestStatus = Constants.requestStatus;
  zonesInfo = Constants.zones;
  allowViewAllUsers = Constants.allowViewAllUsers;
  allowDeleteUser = Constants.allowDeleteUser;
  defaultValue = Constants.defaultValues;
  // defaultValue =  ['userName', 'committee', 'blockNumber', 'role'];
  panelOpenState = false;

  availableBlocks: any = [];
  bufferArray = Array();
  variableValue: any  = '';
  committeesValue: string | null = '';
  newCommitteeArray: string[];
  currentCommittee: any;
  blockNumberValue: string | null;
  roleValue: string | null;
  statusValue: string | null;
  requestStatusValue: string | null;
  searchValue = '';
  selectedZone: string;
  blockValue: string;
  filter_form: FormGroup;
  normalRnMembers = 'Normal RN Members';
  _role: any;
  userdata = Array();
  filterData = Array();
  totalCount: any;
  filterValue: any;

  uid = localStorage.getItem('uid');
  // defaultValueNames = Array();
  dataSource: any = new MatTableDataSource();
  encryptedUserData = localStorage.getItem('userData');
  decryptedUid: any;
  pendingNumber: any;
  hidden = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: userService,
    private authService: Authservice,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.uid = authService.decryptData(this.uid);

    if (localStorage.getItem('filterValue')) {
      const stringValue = JSON.stringify(localStorage.getItem('filterValue'));
      const parseValue = JSON.parse(JSON.parse(stringValue));
      this.columnsToDisplay = parseValue;
      this.variableValue = parseValue;
    } else if (
      !localStorage.getItem('filterValue') ||
      this.variableValue == ''
    ) {
      this.defaultValue.forEach((doc)=>{
        this.bufferArray.push(doc.value)
      })
      this.variableValue = this.bufferArray;
      this.columnsToDisplay = this.bufferArray;
    }
  }

  async ngOnInit() {
    console.log(this.variableValue);
    console.log(this.columnsToDisplay);
    this.checkPending();
    this.getAllusers();
    this.authService.eventcbRole$.subscribe((res) => {
      this._role = res;
    });
    const Role = localStorage.getItem('role');
    if (Role) {
       this._role = this.authService.decryptData(Role);
     }
    this.authService.eventcbCommittee$.subscribe((_com) => {
      this.currentCommittee = _com; // curret committeee
    });

    if (!this.currentCommittee || this.currentCommittee == undefined) {
      const _com = localStorage.getItem('committee');
      if (_com) {
        // to prevent errors
        this.currentCommittee = this.authService.decryptData(_com);
      }
    }
    if (this._role != this.normalRnMembers) {
    }else{
      const obj = this.committees.find((o: any) => o === this.currentCommittee);
      this.bufferArray.push(obj);
      this.committees = this.bufferArray;

    }
  }

  getAllusers() {
    this.userService.getAllUsers();
    this.userService.eventcbUserData$.subscribe((data) => {
      this.dataSource.data = data;
      this.userdata = data;
      this.totalCount = this.userdata.length;
    });
  }

  checkPending() {
    this.userService.checkPendingUsers().subscribe((res) => {
      if (res.length !== 0) {
        this.pendingNumber = res.length;
      } else {
        this.hidden = true;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchInput() {
    if (this.searchValue) {
      const wordToSearch =
        this.searchValue.charAt(0).toUpperCase() + this.searchValue.slice(1);
      this.userService.searchUserData(
        wordToSearch,
        this.userService.currentCommittee
      );
      this.userService.eventcbUserData$.subscribe((res) => {
        this.dataSource.data = res;
        this.userdata = res;
        this.totalCount = this.userdata.length;
      });
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else if (!this.searchValue) {
      this.getAllusers();
    }
  }

  userInfo(uid: any) {
    const encryptedUid = this.authService.encryptData(uid);
    const navigationExtras: NavigationExtras = {
      queryParams: { id: encryptedUid },
    };
    this.router.navigate(['userprofile'], navigationExtras);
  }

  filter() {
    console.log(this.variableValue.value);
    localStorage.setItem('filterValue', JSON.stringify(this.variableValue));
    this.columnsToDisplay = this.variableValue;
    const userData: any = {};
    (userData.committee = this.committeesValue),
      (userData.blockNumber = this.blockNumberValue),
      (userData.role = this.roleValue),
      (userData.status = this.statusValue),
      (userData.requestStatus = this.requestStatusValue),
      console.log(userData);

      this.userService.filterUser(userData);
    this.userService.eventcbUserData$.subscribe((data) => {
      this.dataSource.data = data;
      this.userdata = data;
      this.totalCount = this.userdata.length;
    });
  }

  clearFilter() {
    this.getAllusers();
    this.committeesValue = '';
    this.roleValue = '';
    this.statusValue = '';
    this.requestStatusValue = '';
    this.searchValue = '';
    this.variableValue = this.bufferArray;
    this.columnsToDisplay = this.bufferArray;
    localStorage.removeItem('filterValue');
    localStorage.removeItem('filterData');
    this.searchValue = '';
    this.blockNumberValue = '';
  }

  onChange(value: any) {
    if (this._role == this.normalRnMembers) {
      this.selectedZone = value;
      this.availableBlocks = this.zonesInfo.get(this.selectedZone);
    }
    this.selectedZone = value;
    this.availableBlocks = this.zonesInfo.get(this.selectedZone);
  }

  refresh() {
    location.reload();
  }

  openExcelPreviewDialog() {
    this.dialog.open(excelPreviewDialog, {
      width: '5000px',
      height: '850px',
      data: this.userdata,
    });
  }

  openUploadFileDialog() {
    this.dialog.open(uploadFileDialog, {
      width: '5000px',
      height: '850px',
      data: {
        role: this._role
      }
    });
  }

  async deactivate(uid: any) {
    const userData: any = {};
    userData.status = 'Inactive';
    userData.requestStatus = 'Rejected';
    Swal.fire({
      title: `Deactivate user?`,
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService
          .updateUserData(uid, userData)
          .then(() => {
            Swal.fire('User deactivated', '', 'success').then(() => {});
          })
          .catch((err) => {
            Swal.fire('ERROR', `${err.message}`, 'error');
          });
      }
    });
  }
}
