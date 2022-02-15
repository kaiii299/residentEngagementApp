import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResidentService } from '../resident.service';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExcelExportResidents } from '../excel-export-residents/excel-export-residents';
import { ExcelImportResidents } from '../excel-import-residents/excel-import-residents';
import Swal from 'sweetalert2';
export interface DialogDataResident {
  password: string;
}

@Component({
  selector: 'app-resident-info',
  templateUrl: './resident-info.component.html',
  styleUrls: ['./resident-info.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ResidentInfoComponent implements AfterViewInit, OnInit {

  columnsToDisplay = ['residentName', 'committee', 'blkNum'];
  expandedElement: null;

  filter_form: FormGroup;
  zonesInfo = Constants.zones;
  committees = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];
  genders = Constants.genders;
  ageGps = Constants.ageGps;

  committeeControl: string = ''
  blkNumControl: string = ' '
  ageGpControl: string = ''


  panelOpenState = false;
  search = ""

  totalCount: any
  filterValue: any
  residentdata = Array();
  dataSource: any = new MatTableDataSource();


  accessControlList = Constants.access_control;

  user_role: any;
  user_committee: any;

  accessObj: any;

  canDeleteResident = true;

  filterCommitteeSearchField: any = null;
  filterBlkNumSerachField: any = null;
  filterAgeGpSearchField: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private residentService: ResidentService, private formBuilder: FormBuilder, private router: Router,
    public dialog: MatDialog, private http: HttpClient) {

    this.filter_form = this.formBuilder.group({
      committeeControl: new FormControl,
      blkNumControl: new FormControl,
      ageGpControl: new FormControl,
    });

  }

  async ngOnInit(){
    this.user_role = this.residentService.decryptData(localStorage.getItem("role"));
    this.user_committee = this.residentService.decryptData(localStorage.getItem("committee"));
    this.accessObj = this.accessControlList.get(this.user_role);
    this.canDeleteResident = this.accessObj.deleteResident;
    var body = {committee: null};
    if(!this.accessObj.viewSearchFilterAllResident){
      body = {committee: this.user_committee};
      this.committees = new Array(this.user_committee);
    }
    this.residentService.getAllResidents(body).then((res:any) =>{
      this.dataSource.data = res;
      this.residentdata = res;
      this.totalCount = this.residentdata.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchInput(event: KeyboardEvent) {
    let wordToSearch = this.search.trim().toUpperCase();
    if(event.keyCode === 13){
      var body = {keyword: wordToSearch, committee: this.filterCommitteeSearchField, blkNum: this.filterBlkNumSerachField, ageGp: this.filterAgeGpSearchField};
      if(!this.accessObj.viewSearchFilterAllResident){
        body = {keyword: wordToSearch, committee: this.user_committee, blkNum: this.filterBlkNumSerachField, ageGp: this.filterAgeGpSearchField};
        this.committees = new Array(this.user_committee);
      }
      this.residentService.searchResidentData(body).then((res:any) => {
        this.dataSource.data = res;
        this.residentdata = res;
        this.totalCount = this.residentdata.length;
      });

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  onClickViewDetails(id: any) {
    var encryptedResid = this.residentService.encryptData(id)
    let navigationExtras: NavigationExtras = {queryParams: {id: encryptedResid}}
    this.router.navigate(['residentdetail'], navigationExtras)
  }

  onClickEdit(id: any){
    var encryptedResid = this.residentService.encryptData(id)
    let navigationExtras: NavigationExtras = {queryParams: {id: encryptedResid}}
    this.router.navigate(['updateresident'], navigationExtras)
  }
  delete(id: any){
    // console.log(id);
    Swal.fire({
      title: 'Are you sure you want to delete this resident from records?',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      denyButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed){
        this.residentService.deleteResident(id);
        Swal.fire({
          title: 'Resident has been removed from records',
          timer: 800,
          icon: 'success',
        });
      }else if (result.isDenied){
        Swal.fire('Error removing resident !!')
      }
    })
  }
  onClickFilter(event: any) {
    event.blkNumControl = event.blkNumControl.trim();
    if(event.committeeControl.trim().length != 0){
      this.filterCommitteeSearchField = event.committeeControl;
    }
    if(event.blkNumControl.trim().length != 0){
      this.filterBlkNumSerachField = event.blkNumControl;
    }
    if(event.ageGpControl.trim().length != 0){
      this.filterAgeGpSearchField = event.ageGpControl;
    }
    this.residentService.filterResident({committee: event.committeeControl, blkNum: event.blkNumControl, ageGp: event.ageGpControl}).then((res:any) => {
      this.dataSource.data = res;
      this.residentdata = res;
      this.totalCount = this.residentdata.length;
    });
  }

  onChange(value: any) {
    this.selectedZone = value;
    this.availableBlocks = this.zonesInfo.get(this.selectedZone);
  }
  refresh() {
    location.reload();
  }
  openExcelExport(){
    let residentData = this.residentdata;
    // residentData.forEach(residentD => {
    //   let str ='';
    //   let activitiesArr = residentD.data.activities;
    //   for(let i=1; i<activitiesArr.length; i++){
    //     let activityStr = activitiesArr[i];
    //     str += activityStr;
    //     if(i != activitiesArr.length){
    //       str += " ,";
    //     }
    //   }
    //   activitiesArr.forEach(activityStr => {
    //     str += activityStr;
    //   });
    //   residentD.data.activities = str;
    //   console.log(residentD);
    // });
    // console.log(residentData);
    this.dialog.open(ExcelExportResidents, {
      width: '750px',
      height: '650px',
      data: residentData
    })
  }
  openExcelImport(){
    this.dialog.open(ExcelImportResidents, {
      width: '750px',
      height: '650px',
    })
  }

}


