import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { InputSurveyComponent } from '../input-survey/input-survey.component';
import { Constants } from '../constants';


@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss']
})
export class ResidentDetailComponent implements OnInit {
  residentDetailsForm: any;
  residentDetail: any;

  resid = this.activatedRoute.snapshot.queryParams.id;

  constructor(private residentService: ResidentService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) {
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

  // ngOnInit(): void {
  //   this.residentService.getResidentById(this.residentId).subscribe(residentInfo => {
  //     console.log(residentInfo);
  //     this.residentDetail = residentInfo;
  //   })
  // }

  async ngOnInit() {
    const decryptedResid = this.residentService.decryptData(this.resid);
    await this.residentService.getResidentById(decryptedResid).toPromise().then((data) => {
      console.log("get resident details..")
      console.log(data);
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
  }

  openSurveyDialog() {
    this.dialog.open(InputSurveyComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'custom-modalbox'
    });
  }

}

// @Component({
//   selector: 'input-survey-dialog',
//   templateUrl: './inputSurvey-dialog.html',
//   styleUrls: ['./inputSurvey-dialog.scss']
// })
// export class InputSurveyDialog{
//   surveyForm: FormGroup;
//   activitiesList = Constants.activities;
//   constructor(private formBuilder: FormBuilder) {

//   }
//   ngOnInIt(): void {

//     this.surveyForm = this.formBuilder.group({
//       activities: new FormArray([], [Validators.required])
//     });
//     console.log(this.surveyForm.controls.activities);
//     this.activitiesList.forEach(() => this.activitiesFormArray.push(new FormControl(false)));
//   }
//   get activitiesFormArray() {
//     return this.surveyForm.controls.activities as FormArray;
//   }
// }
