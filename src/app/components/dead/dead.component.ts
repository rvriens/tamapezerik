import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { CharacterService } from '../../services/character.service';
import { EggService } from '../../services/egg.service';

@Component({
  selector: 'app-dead',
  templateUrl: './dead.component.html',
  styleUrls: ['./dead.component.scss'],
})
export class DeadComponent implements OnInit {
  @Output() confirmDead = new EventEmitter();
  fullname: string;
  alias: string;
  imgurl: string;
  confirmLoading = false;

  constructor(private eggService: EggService,
              private characterService: CharacterService,
              private fireStorage: AngularFireStorage,
              private detector: ChangeDetectorRef) { }

  ngOnInit() {
    this.characterService.getCharacter().subscribe( c => {
      if (c) {
        this.fullname = c.fullname;
        this.alias = c.alias ?? this.fullname;
        const ref = this.fireStorage.ref(`/characters/${c.name}/sad.png`);
        ref.getDownloadURL().toPromise().then( (url) => {
          this.imgurl = url;
          setTimeout(() => this.detector.detectChanges(), 10);
        });
      }
    });
  }

  playAgain(ev: Event) {
    this.confirmLoading = true;
    this.eggService.confirmDead();
    this.confirmDead.emit();
  }
}
