import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Constants } from '../constants';


@Component({
  selector: 'app-resident-info',
  templateUrl: './resident-info.component.html',
  styleUrls: ['./resident-info.component.scss']
})
export class ResidentInfoComponent implements OnInit {

  committees = Constants.committees;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activities = Constants.activities;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

}
