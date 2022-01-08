import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResidentService } from '../resident.service';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';


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

  columnsToDisplay = ['residentName', 'committee'];
  expandedElement: null;

  committees = Constants.committees;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activities = Constants.activities;

  panelOpenState = false;
  search = ""

  filter_form: FormGroup;

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private residentService: ResidentService, private formBuilder: FormBuilder, private router: Router) {

    this.filter_form = this.formBuilder.group({
      committeeControl: new FormControl,
      ageGpcontrol: new FormControl,
    });

    residentService.getAllResidents().subscribe((data) => {
      //console.log(data);
      let residentData = data;
      console.log(residentData);
      this.dataSource.data = residentData;
      console.log(this.dataSource.data);
      
    })

  }


  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    
  }
  applyFilter(event: Event) {
     // (event.target as HTMLInputElement).value = "home"
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }
  
  onClickViewDetails(obj: any){
    console.log(obj);
    console.log(obj.id);
    let resid = obj.id;
    let navigationExtras: NavigationExtras = {queryParams: {id: resid}};
    this.router.navigate(['residentdetail'], navigationExtras)
  }
  onClickEdit(obj : any){
    console.log(obj);
    console.log(obj.id);
    let resid = obj.id;
    let navigationExtras: NavigationExtras = {queryParams: {id: resid}};
    this.router.navigate(['updateresident'], navigationExtras)
  }
  // openDeleteDialog() {
  //   this.dialog.open(deleteConfirmationDialog, {
  //     width: '300px',
  //     height: '150px'
  //   })
  // }
  onClickDelete(obj : any){
    console.log(obj);
    console.log(obj.id);
    let resid = obj.id;
    this.residentService.deleteResident(resid);
  }

}
