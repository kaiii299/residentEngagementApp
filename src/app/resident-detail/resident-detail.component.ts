import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { InputSurveyComponent } from '../input-survey/input-survey.component';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss']
})
export class ResidentDetailComponent implements OnInit {
  residentDetailsForm: any;
  residentDetail: any;
  feedbackForm: any;
  surveys: any = [];

  resid = this.activatedRoute.snapshot.queryParams.id;

  constructor(private residentService: ResidentService, private activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private router: Router) {
    this.residentDetailsForm = new FormGroup({
      residentNameControl: new FormControl('', [Validators.required]),
      committeeControl: new FormControl('', [Validators.required]),
      blkNumControl: new FormControl('', [Validators.required]),
      unitNumControl: new FormControl('', [Validators.required]),
      genderControl: new FormControl('', [Validators.required]),
      raceControl: new FormControl('', [Validators.required]),
      ageGpControl: new FormControl('', [Validators.required]),
      expertiseControl: new FormControl('', [Validators.required]),
    });

    
  }

  async ngOnInit() {
    const decryptedResid = this.residentService.decryptData(this.resid);
    await this.residentService.getResidentById(decryptedResid).toPromise().then((data) => {
      // console.log("get resident details..")
      // console.log(data);
      let residentDetail: any = data.residentData;
      this.residentDetailsForm.patchValue({
        residentNameControl: residentDetail.residentName,
        committeeControl: residentDetail.committee,
        blkNumControl: residentDetail.blkNum,
        unitNumControl: residentDetail.unitNum,
        genderControl: residentDetail.gender,
        raceControl: residentDetail.race,
        ageGpControl: residentDetail.ageGp,
        expertiseControl: residentDetail.expertise,
      });
    })
    console.log(decryptedResid);
    await this.residentService.getSurveyByResidentID(decryptedResid).then((res) => {
      // console.log("get survey");
      //console.log(res);
      var dataList:any = [];
      for (const e of res) {
        let surveryData = e.data;
        let surDate = new Date(surveryData.date);

        surveryData.surveryDate = surDate;
        dataList.push(surveryData);
      }

      dataList.sort((a:any, b:any) => {
        return <any>new Date(b.surveryDate) - <any>new Date(a.surveryDate);
      })
      // console.log("sorted data...");
      // console.log(dataList);
      this.surveys = dataList;
      console.log(this.surveys);
    })
  }
  onClickEdit(){
    let navigationExtras: NavigationExtras = {queryParams: {id : this.resid}}
    this.router.navigate(['updateresident'], navigationExtras)
  }

  openSurveyDialog() {
    this.dialog.open(InputSurveyComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'custom-modalbox'
    });
  }

}

