import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
message= " "
email = ""
password=""
hide = true
  constructor() { }

  ngOnInit(): void {
  }

  errorMessage(){
    if(this.email == ""){
      this.message ="Please provide email"
    }

    else if(this.password == ""){
      this.message ="Please provide Password"
    }

    else{
      alert("okay work")
    }

  }

}
