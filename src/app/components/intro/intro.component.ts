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

  constructor(
      private characterService: CharacterService,
      private eggService: EggService,
      private detector: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.characterService.getCharacter().pipe(map( (c) => c.initial)).subscribe( i => {
      this.initialText = i + 'hallo';
      setTimeout(() => this.detector.detectChanges(), 10);
    });
  }

  closeOpening() {
    this.eggService.closeOpening();
  }

}
