import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-emphase',
  templateUrl: './emphase.component.html',
  styleUrls: ['./emphase.component.scss']
})
export class EmphaseComponent implements OnInit, OnChanges {

  prefix = '';
  suffix = '';

  @Input() text = '';
  @Input() emphase = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.text) {
      this.prefix = '';
      this.suffix = '';
      return;
    }
    const index = this.text.indexOf(this.emphase);
    this.prefix = this.text.substring(0, index);
    this.suffix = this.text.substring(index + this.emphase.length);
  }

}
