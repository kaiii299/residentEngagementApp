import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { userDataInterface } from 'src/app/share/services/Users'
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
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
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
  panelOpenState = false;

  availableBlocks: any = [];
  variableValue: any | null = '';
  committeesValue: string | null = '';
  blockNumberValue: string | null;
  roleValue: string | null;
  statusValue: string | null;
  requestStatusValue: string | null;
  searchValue: string = '';
  selectedZone: string;
  blockValue: string;
  filter_form: FormGroup;
  _role: any;
  userdata = Array();
  filterData = Array();
  totalCount: any;
  filterValue: any;

  uid = localStorage.getItem("uid");
  defaultValue = ['userName', 'committee', 'blockNumber', 'role'];
  dataSource: any = new MatTableDataSource();
  encryptedUserData = localStorage.getItem("userData");
  decryptedUid: any;
  pendingNumber: any;
  hidden = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: userService, private authService: Authservice, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private http: HttpClient) {

    this.uid = authService.decryptData(this.uid)

    if (localStorage.getItem("filterValue")) {
      const stringValue = JSON.stringify(localStorage.getItem("filterValue"));
      const parseValue = JSON.parse(JSON.parse(stringValue))
      this.columnsToDisplay = parseValue;
      this.variableValue = parseValue;
    }
    else if (!localStorage.getItem("filterValue") || this.variableValue == '') {
      this.variableValue = this.defaultValue;
      this.columnsToDisplay = this.defaultValue;
    }
  }

  async ngOnInit() {
    this.checkPending();
    this.getAllusers();
    const role = localStorage.getItem("role");
    this._role = this.authService.decryptData(role);
  }

  getAllusers(){
    this.userService.getAllUsers();
    this.userService.eventcbUserData$.subscribe((data) => {
      this.dataSource.data = data;
      this.userdata = data;
      this.totalCount = this.userdata.length
    })
  }

  checkPending(){
    this.userService.checkPendingUsers().subscribe((res)=>{
      if(res.length !== 0){
        this.pendingNumber = res.length
      }
      else{
        this.hidden = true
      }
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchInput() {
    if (this.searchValue) {
      let wordToSearch = this.searchValue.charAt(0).toUpperCase() + this.searchValue.slice(1);
      this.userService.searchUserData({ keyword: wordToSearch });
      this.userService.eventcbUserData$.subscribe((res) => {
        this.dataSource.data = res;
        this.userdata = res;
        this.totalCount = this.userdata.length;
      })
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else if (!this.searchValue){
      this.getAllusers();
    }
  }

  userInfo(uid: any) {
    var encryptedUid = this.authService.encryptData(uid)
    const navigationExtras: NavigationExtras = { queryParams: { id: encryptedUid } }
    this.router.navigate(['userprofile'], navigationExtras)
  }

  getData(data: any) {
    console.log(data);
  }

  filter() {
    localStorage.setItem("filterValue", JSON.stringify(this.variableValue))
    this.columnsToDisplay = this.variableValue
    let userData: any = {}
    userData['committee'] = this.committeesValue,
      userData['blockNumber'] = this.blockNumberValue,
      userData['role'] = this.roleValue,
      userData['status'] = this.statusValue,
      userData['requestStatus'] = this.requestStatusValue,
      this.userService.filterUser(userData);
      this.userService.eventcbUserData$.subscribe((data) => {
      console.log(userData);
      console.log(data);
      this.dataSource.data = data;
      this.userdata = data;
      this.totalCount = this.userdata.length;
    });

  }

  clearFilter() {
    this.getAllusers();
    this.committeesValue = "";
    this.roleValue = '';
    this.statusValue = '';
    this.requestStatusValue = '';
    this.searchValue = '';
    this.variableValue = this.defaultValue;
    this.columnsToDisplay = this.defaultValue;
    localStorage.removeItem("filterValue");
    localStorage.removeItem("filterData");
    this.searchValue = "";
    this.blockNumberValue = "";
  }

  onChange(value: any) {
    this.selectedZone = value;
    this.availableBlocks = this.zonesInfo.get(this.selectedZone);
  }

  refresh() {
    location.reload()
  }

  openExcelPreviewDialog() {
    this.dialog.open(excelPreviewDialog, {
      width: '750px',
      height: '650px',
      data: this.userdata
    })
  }

  async uploadFile() {
    this.dialog.open(uploadFileDialog,{
      width: '750px',
      height: '650px'
    })
  }

  async deactivate(uid: any) {
    const decryptedid = this.authService.decryptData(uid);
    let userData: any = {}
    userData['status'] = 'Inactive'
    userData['requestStatus'] = 'Rejected'
    Swal.fire({
      title: `Deactivate user?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUserData(decryptedid, userData).then(() => {
          Swal.fire('User deactivated', '', 'success').then(()=>{
            setTimeout(() => {
              location.reload(), 80000;
            });
          })
        }).catch((err) => {
          Swal.fire('ERROR', `${err.message}`, 'error')
        })
      }
    })
  }
}

