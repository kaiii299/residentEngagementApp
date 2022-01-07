import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {userDataInterface} from 'src/app/share/services/Users'
import { Constants } from '../constants';
import { Authservice } from '../share/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router} from '@angular/router';


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

export class AllUsersComponent implements AfterViewInit {
  columnsToDisplay = ['firstName', 'email', 'committee', 'blockNumber','status'];
  expandedElement:  null;

  committees = Constants.committees
  roles = Constants.roles
  status = Constants.status
  blockNumber = Constants.blkNum

  panelOpenState = false;
  search = "";
  committeesValue: string;
  roleValue: string;
  statusValue: string;
  blockValue:string
  searchValue: any;
  filiter_form: FormGroup
  uid = localStorage.getItem("uid");

  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService:Authservice,private formBuilder: FormBuilder, private router: Router) {
    authService.getAllUsers().subscribe(data=>{
      let userData = data
      this.dataSource.data = userData
    })
    this.uid = authService.decryptData(this.uid)
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

  userInfo(uid: any){
    const navigationExtras: NavigationExtras = {queryParams:{id: uid}}
    this.router.navigate(['myprofile'],navigationExtras)
  }

}

