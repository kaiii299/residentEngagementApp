import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss']
})
export class ResidentDetailComponent implements OnInit {
  residentId: string;
  residentDetail: any;

  constructor(private residentService: ResidentService, private activatedRoute: ActivatedRoute, public dialog: MatDialog ) {
    this.residentId = this.activatedRoute.snapshot.queryParams.id;
    console.log(this.residentId)
   }

   ngOnInit(): void {
    this.residentService.getResidentById(this.residentId).subscribe(residentInfo =>{
      console.log(residentInfo);
      this.residentDetail = residentInfo;
    })

  }
  openSurveyDialog(){
    this.dialog.open(InputSurveyDialog,{
      width: '700px',
      height: '500px',
      panelClass: 'custom-modalbox'
    });
  }

}

@Component({
  selector: 'input-survey-dialog',
  templateUrl: './inputSurvey-dialog.html',
  styleUrls: ['./inputSurvey-dialog.scss']
})
export class InputSurveyDialog {
  surveyForm: FormGroup;
  constructor(private formBuilder: FormBuilder){

  }
  ngOnInIt(): void {

    this.surveyForm = this.formBuilder.group({

    })

  }
}
