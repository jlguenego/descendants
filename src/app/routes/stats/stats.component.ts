import { Component, OnInit } from '@angular/core';
import { EntityService } from 'src/app/entity.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ReadyService } from 'src/app/ready.service';

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
  constructor(private entity: EntityService, private route: ActivatedRoute, private ready: ReadyService) { }

  ngOnInit() {
    this.ready.notify(false);
    this.route.params.pipe(map(params => params.id)).subscribe(id => {
      this.entity.get(id).subscribe(entity => {
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
        this.ready.notify(true);
      });
    });
  }

}
