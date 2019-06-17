import { Component, OnInit } from '@angular/core';
import { EntityService } from 'src/app/entity.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  name = 'Saint-Louis';
  descendantCount = 0;
  survivors = 102;
  current: any = {};
  constructor(private entity: EntityService) { }

  ngOnInit() {
    this.entity.get(this.entity.getCurrent()).subscribe(entity => {
      console.log('entity', entity);
      this.current = entity;
      this.descendantCount = entity.results.bindings[0].descendantCount.value;
    });
  }

}
