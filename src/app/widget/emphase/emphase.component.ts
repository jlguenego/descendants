import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-emphase',
  templateUrl: './emphase.component.html',
  styleUrls: ['./emphase.component.scss']
})
export class EmphaseComponent implements OnInit, OnChanges {

  prefix = '';
  suffix = '';
  emphaseFromText = '';

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
    const index = this.text.toLowerCase().indexOf(this.emphase.toLowerCase());
    this.prefix = this.text.substring(0, index);
    this.emphaseFromText = this.text.substring(index, index + this.emphase.length);
    this.suffix = this.text.substring(index + this.emphase.length);
  }

}
