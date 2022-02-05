import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-input-survey',
  templateUrl: './input-survey.component.html',
  styleUrls: ['./input-survey.component.scss']
})
export class InputSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  contacts = Constants.contact;
  activitiesList = Constants.activities;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      contact: new FormArray([],[Validators.required]),
      activities: new FormArray([],[Validators.required])
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

}
