import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showFiller = false;
  title = 'resident-engagement-app';

  ngOnInit(): void {
  }
}
