import { Component, OnInit } from '@angular/core';
import { ReadyService } from 'src/app/ready.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(public ready: ReadyService) { }

  ngOnInit() {
  }


}
