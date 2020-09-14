import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EggService } from 'src/app/services/egg.service';

@Component({
  selector: 'app-dead',
  templateUrl: './dead.component.html',
  styleUrls: ['./dead.component.scss'],
})
export class DeadComponent implements OnInit {
  @Output() confirmDead = new EventEmitter();
  constructor(private eggService: EggService) { }

  ngOnInit() {}

  playAgain() {
    this.eggService.confirmDead();
    this.confirmDead.emit();
  }
}
