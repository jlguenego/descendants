import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-emphase',
  templateUrl: './emphase.component.html',
  styleUrls: ['./emphase.component.scss']
})
export class EmphaseComponent implements OnInit, OnChanges {

  prefix: string;
  suffix: string;

  @Input() text: string;
  @Input() emphase: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const index = this.text.indexOf(this.emphase);
    this.prefix = this.text.substring(0, index);
    this.suffix = this.text.substring(index + this.emphase.length);
  }

}
