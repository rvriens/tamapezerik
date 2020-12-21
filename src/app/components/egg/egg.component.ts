import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-egg',
  templateUrl: './egg.component.html',
  styleUrls: ['./egg.component.scss'],
})
export class EggComponent implements OnInit {
  @Output() openEgg = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  open(ev: Event) {
    this.openEgg.emit();
  }

}
