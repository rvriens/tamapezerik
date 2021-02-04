import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { delay, map } from 'rxjs/operators';
import { EggService } from 'src/app/services/egg.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {

  public initialText: string;
  public fullname: string;
  public tipText: string;
  public closeOpeningForm: FormGroup;
  public confirmOpeningLoading = false;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    scrollbar: {
      hide: true
    },
    pagination: false,
    autoplay: {
      delay: 3000,
    }
  };

  constructor(
      private characterService: CharacterService,
      private eggService: EggService,
      private detector: ChangeDetectorRef,
      private fb: FormBuilder
    ) { }

  ngOnInit() {

    this.closeOpeningForm = this.fb.group({
      alias: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });

    this.characterService.getCharacter().subscribe( c => {
      if (c) {
      this.initialText = `${c.initial}`;
      this.tipText = `${c.tip}`;
      this.fullname = c.fullname;
      setTimeout(() => this.detector.detectChanges(), 10);
      }
    });
  }

  closeOpening(ev: Event) {
    if (this.closeOpeningForm.valid) {
      this.confirmOpeningLoading = true;
      this.eggService.closeOpening(this.closeOpeningForm.value.alias);
    }
  }

}
