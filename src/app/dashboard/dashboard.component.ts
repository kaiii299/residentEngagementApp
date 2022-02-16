import { Component, OnInit } from '@angular/core';
import { ResidentService } from '../resident.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private residentService: ResidentService) { }

  async ngOnInit(){

   
  }

}
