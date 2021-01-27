import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { map } from 'rxjs/operators';
import { EggService } from 'src/app/services/egg.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {

  public initialText: string;
  public tipText: string;
  public alias: string;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
      private characterService: CharacterService,
      private eggService: EggService,
      private detector: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.characterService.getCharacter().subscribe( c => {
      if (c) {
      this.initialText = `${c.initial}`;
      this.tipText = `${c.tip}`;
      setTimeout(() => this.detector.detectChanges(), 10);
      }
    });
  }

  closeOpening(ev: Event) {
    this.eggService.closeOpening(this.alias);
  }

}
