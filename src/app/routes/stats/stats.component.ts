import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  name = 'Saint-Louis';
  total = 1234;
  survivors = 102;
  constructor() { }

  ngOnInit() {
  }

}
