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
      this.message ="Email cannot be Empty"
    }

    else if(this.password == ""){
      this.message ="Password cannot be Empty"
    }

    else{
      alert("okay work")
    }

  }

}
