import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ResidentService } from '../resident.service';



@Component({
  selector: 'app-input-survey',
  templateUrl: './input-survey.component.html',
  styleUrls: ['./input-survey.component.scss']
})
export class InputSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  contacts = Constants.contact;
  activitiesList = Constants.activities;

  resid = this.activatedRoute.snapshot.queryParams.id;
  decryptedResid = this.residentService.decryptData(this.resid);

  submitStatus:String;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private residentService: ResidentService, public dialogRef: MatDialogRef<InputSurveyComponent>) {

   }

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      date: new FormControl([],[Validators.required]),
      contact: new FormArray([],[Validators.required]),
      mobileNum: new FormControl('', [Validators.required]), 
      email: new FormControl('', [Validators.required]),
      activities: new FormArray([],[Validators.required]),
      numElderly: new FormControl('', [Validators.required]),
      numAdult: new FormControl('', [Validators.required]),
      numYouth: new FormControl('', [Validators.required]),
      numChild: new FormControl('', [Validators.required]),
      job: new FormControl('', [Validators.required]),
    }) 
    this.contacts.forEach(() => this.contactFormArray.push(new FormControl(false)));
    this.activitiesList.forEach(() => this.activitiesFormArray.push(new FormControl(false)));
  }
  get contactFormArray(){
    return this.surveyForm.controls.contact as FormArray;
  }
  get activitiesFormArray(){
    return this.surveyForm.controls.activities as FormArray;
  }
  submit(value: any){
    console.log(value);
    let temp_contact = value.contact;
    var selected_contact = [];
      for (let i = 0; i < temp_contact.length; i++){
        let get_contact = this.contacts[i];
        if(temp_contact[i]){
          selected_contact.push(get_contact);
        }
      }
    let temp_activities = value.activities;
    var selected_activities = [];
    for (let j = 0; j < temp_activities.length; j++){
      let get_activity = this.activitiesList[j];
      if(temp_activities[j]){
        selected_activities.push(get_activity);
      }
    }
    if (this.surveyForm.valid && selected_contact.length !=0 && selected_activities.length !=0){
      value.contact = selected_contact;
      value.activities = selected_activities;
      let survey = {
        residentId: this.decryptedResid,
        date: value.date,
        contact: value.contact,
        mobileNum: value.mobileNum,
        email: value.email,
        activities: value.activities,
        numElderly: value.numElderly,
        numAdult: value.numAdult,
        numYouth: value.numYouth,
        numChild: value.numChild,
        job: value.job,        
      }
      this.residentService.addSurvey(survey).then((results) => {
        if(results){
          location.reload();
        }
        
      })
    }
  }

}
