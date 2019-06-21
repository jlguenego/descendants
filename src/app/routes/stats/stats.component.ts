import { Component, OnInit } from '@angular/core';
import { EntityService } from 'src/app/entity.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  name = 'xxx';
  deadCount = 0;
  aliveCount = 0;
  current: any = {};
  constructor(private entity: EntityService) { }

  ngOnInit() {
    if (this.entity.getCurrent() === undefined) {
      return;
    }
    this.entity.get(this.entity.getCurrent()).subscribe(entity => {
      console.log('entity', entity);
      this.name = entity.results.bindings[0].itemLabel.value;
      this.current = entity;
      if (entity.results.bindings.length === 0) {
        return;
      }
      const dead = entity.results.bindings.find(row => row.dead.value === 'true');
      const alive = entity.results.bindings.find(row => row.dead.value === 'false');
      this.deadCount = +dead.descendantCount.value;
      this.aliveCount = +alive.descendantCount.value;
    });
  }

}
