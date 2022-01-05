import { Component, OnInit } from '@angular/core';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss']
})
export class ResidentDetailComponent implements OnInit {
  residentId: string;
  residentDetail: any;

  constructor(private residentService: ResidentService, private activatedRoute: ActivatedRoute) {
    this.residentId = this.activatedRoute.snapshot.queryParams.id;
    console.log(this.residentId)
   }

  ngOnInit(): void {
    this.residentService.getResidentById(this.residentId).subscribe(residentInfo =>{
      console.log(residentInfo);
      this.residentDetail = residentInfo;
    })

  }

}
