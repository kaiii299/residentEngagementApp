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
export class ResidentInfoComponent implements AfterViewInit {

  columnsToDisplay = ['residentName', 'committee','blkNum'];
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

  dataSource = new MatTableDataSource();

  residentData:any; 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private residentService: ResidentService, private formBuilder: FormBuilder, private router: Router,
    public dialog: MatDialog) {

    this.filter_form = this.formBuilder.group({
      committeeControl: new FormControl,
      blkNumControl: new FormControl,
      ageGpControl: new FormControl,
    });

    residentService.getAllResidents().subscribe((data) => {
      //console.log('data length..');
      //console.log(data.length);
      this.totalCount = data.length;
      this.residentData = data;
      //console.log(residentData);
      this.dataSource.data = this.residentData;
      //console.log(this.dataSource.data);

    })

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event : KeyboardEvent) {
    event.stopPropagation();
    this.dataSource.filter = this.search.trim().toLocaleLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickViewDetails(obj: any) {
    console.log(obj);
    console.log(obj.id);
    let resid = obj.id;
    let navigationExtras: NavigationExtras = { queryParams: { id: resid } };
    this.router.navigate(['residentdetail'], navigationExtras)
  }
  onClickEdit(obj: any) {
    console.log(obj);
    console.log(obj.id);
    let resid = obj.id;
    let navigationExtras: NavigationExtras = { queryParams: { id: resid } };
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
    if(event.committeeControl && event.blkNumControl && event.ageGpControl){
      this.dataSource.data = this.residentData.filter(function(resident :any) {
        return resident.committee == event.committeeControl &&
        resident.blkNum == event.blkNumControl &&
        resident.ageGp == event.ageGpControl
      });
    }
    if(event.committeeControl && event.blkNumControl && !event.ageGpControl){
      this.dataSource.data = this.residentData.filter(function(resident :any) {
        return resident.committee == event.committeeControl &&
        resident.blkNum == event.blkNumControl 
      });
    }
    if(event.committeeControl && !event.blkNumControl && event.ageGpControl){
      this.dataSource.data = this.residentData.filter(function(resident :any) {
        return resident.committee == event.committeeControl &&
        resident.ageGp == event.ageGpControl 
      });
    }
    if(!event.committeeControl &&! event.blkNumControl && event.ageGpControl){
      this.dataSource.data = this.residentData.filter(function(resident :any) {
        return resident.ageGp == event.ageGpControl
      });
    }
    if(event.committeeControl && !event.blkNumControl && !event.ageGpControl){
      this.dataSource.data = this.residentData.filter(function(resident :any) {
        return resident.committee == event.committeeControl 
      });
    }
  }

  onChange(value: any) {
    this.selectedZone = value;
    this.availableBlocks = this.zonesInfo.get(this.selectedZone);
  }
  refresh(){
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
