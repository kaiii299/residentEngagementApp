import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OTPComponent implements OnInit {
  number: any

  states: string[] = [
    "65",
    "60",
    "63",
    "62",
    "91"
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
