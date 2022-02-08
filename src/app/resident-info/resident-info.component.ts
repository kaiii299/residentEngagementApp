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
import { DialogData } from "../user-profile/user-profile.component";
import { HttpClient } from '@angular/common/http';


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
    console.log("user role -> "+this.user_role);
    console.log("user committee -> "+this.user_committee);
    this.accessObj = this.accessControlList.get(this.user_role);
    this.canDeleteResident = this.accessObj.deleteResident;
    
    console.log(this.accessObj);
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
    this.dataSource.data.sort = this.sort;
  }

  searchInput(event: KeyboardEvent) {
    let wordToSearch = this.search.trim().toUpperCase();
    if(event.keyCode === 13){
      var body = {keyword: wordToSearch, committee: null};
      if(!this.accessObj.viewSearchFilterAllResident){
        body = {keyword: wordToSearch, committee: this.user_committee};
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

  // onClickViewDetails(obj: any) {
  //   console.log(obj);
  //   console.log(obj.id);
  //   let resid = obj.id;
  //   let navigationExtras: NavigationExtras = { queryParams: { id: resid } };
  //   this.router.navigate(['residentdetail'], navigationExtras)
  // }
  onClickViewDetails(id: any) {
    console.log(id);
    var encryptedResid = this.residentService.encryptData(id)
    let navigationExtras: NavigationExtras = {queryParams: {id: encryptedResid}}
    this.router.navigate(['residentdetail'], navigationExtras)
  }

  // onClickEdit(obj: any) {
  //   console.log(obj);
  //   console.log(obj.id);
  //   let resid = obj.id;
  //   let navigationExtras: NavigationExtras = { queryParams: { id: resid } };
  //   this.router.navigate(['updateresident'], navigationExtras)
  // }
  onClickEdit(id: any){
    console.log(id);
    var encryptedResid = this.residentService.encryptData(id)
    let navigationExtras: NavigationExtras = {queryParams: {id: encryptedResid}}
    this.router.navigate(['updateresident'], navigationExtras)
  }

  openDeleteDialog(obj: any) {
    console.log("obj");
    console.log(obj);
    this.dialog.open(DeleteResidentConfirmationDialog, {
      width: '300px',
      height: '150px',
      data: { deleteId: obj.id },
    })
  }
  onClickFilter(event: any) {
    console.log(event);
    event.blkNumControl = event.blkNumControl.trim();
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
    location.reload()
  }

}

@Component({
  selector: 'delete-resident-confirmation-dialog',
  templateUrl: './deleteResident-dialog.html',
})
export class DeleteResidentConfirmationDialog {
  deleteId = '';
  data: any;
  constructor(public dialogRef: MatDialogRef<ResidentInfoComponent>, private residentService: ResidentService, @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.data = this.dialogData;
  }

  onNoClick() {
    this.dialogRef.close();

  }

  delete() {
    console.log("delete id ..");
    console.log(this.data);
    this.residentService.deleteResident(this.data.deleteId);
    this.dialogRef.close();
  }

}
