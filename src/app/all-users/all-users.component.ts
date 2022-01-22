import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {userDataInterface} from 'src/app/share/services/Users'
import { Constants } from '../constants';
import { Authservice } from '../share/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router} from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { excelPreviewDialog } from '../share/excel-preview-dialog';
import { uploadFileDialog } from '../share/upload-file';
import { HttpClient } from '@angular/common/http';


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
  expandedElement:  null;
  committees = Constants.committees
  roles = Constants.roles
  status = Constants.status
  blockNumber = Constants.blkNum
  variables = Constants.variables
  panelOpenState = false;
  search: any;
  variableValue: any = '';
  committeesValue: string ='';
  roleValue: string ='' ;
  statusValue: string ='';
  blockValue:string;
  searchValue: any;
  filter_form: FormGroup
  uid = localStorage.getItem("uid");
  userdata : any;
  totalCount: any;
  filterValue: any;
  defaultValue:any =  ['userName','committee', 'blockNumber','role'];
  dataSource:any = new MatTableDataSource();
  baseUrl = "https://us-central1-residentappv2-affc6.cloudfunctions.net/api";
  encryptedUserData = localStorage.getItem("userData");


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService:Authservice,private formBuilder: FormBuilder, private router: Router,private dialog: MatDialog, private http: HttpClient) {

    this.uid = authService.decryptData(this.uid)

    if(localStorage.getItem("filterValue")){
      const stringValue = JSON.stringify(localStorage.getItem("filterValue"));
      const parseValue = JSON.parse(JSON.parse(stringValue))
      this.columnsToDisplay = parseValue;
      this.variableValue = parseValue;
    }
    else if(!localStorage.getItem("filterValue") || this.variableValue ==''){
      this.variableValue = this.defaultValue;
      this.columnsToDisplay = this.defaultValue;
    }
  }
  async ngOnInit(){

    // this.authService.eventcbAllUserData$.subscribe((data) => {
    //   this.userdata = data
    //   this.dataSource.data = data
    //   console.log(data);
    // });

    const decryptedUserData = this.authService.decryptData(this.encryptedUserData)
    const userData = JSON.parse(decryptedUserData)
    this.dataSource.data = userData;
    this.totalCount = userData.length
    console.log(userData)


    // const data = this.http.get(this.baseUrl + "/getAllUsers").toPromise();
    // console.log(data);
    // this.dataSource.data = await data
    // this.userdata = await data;

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  userInfo(uid: any){
    var encryptedUid = this.authService.encryptData(uid)
    const navigationExtras: NavigationExtras = {queryParams:{id: encryptedUid}}
    this.router.navigate(['myprofile'],navigationExtras)
  }

  getData(data: any){
    console.log(data);

  }

  filter(event: KeyboardEvent){
    if(this.committeesValue){
      this.dataSource.filter  = this.committeesValue;
    }
    if(this.roleValue){
      this.dataSource.filter  = this.roleValue;
    }
    if(this.statusValue){
      this.dataSource.filter  = this.statusValue;
    }
    if(this.variableValue !='' && this.variableValue !=undefined){
      localStorage.setItem("filterValue",JSON.stringify(this.variableValue))
      this.columnsToDisplay = this.variableValue
    }
  }

  clearFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value = " "
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.committeesValue ="";
    this.roleValue = '';
    this.statusValue ='';
    this.search = null;
    this.variableValue = this.defaultValue;
    this.columnsToDisplay = this.defaultValue;
    localStorage.removeItem("filterValue")
    this.searchValue = ""
  }

  refresh(){
    location.reload()
  }

  openExcelPreviewDialog(){
    this.dialog.open(excelPreviewDialog,{
      width:'600px',
      height:'700px',
      data: this.userdata
    })
  }

  uploadFile(){
    this.dialog.open(uploadFileDialog),{

    }
  }
}

