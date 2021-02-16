import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EggService } from '../../services/egg.service';
import { Store } from '@ngrx/store';
import { selectEggStatus, selectEggLoading, selectEggAnimation } from '../../selectors/egg.selectors';
import { EggStatus } from '../../reducers/egg.reducer';
import * as EggActions from '../../actions/egg.actions';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.scss']
})
export class TamagotchiComponent implements OnInit {

  public eggStatus: EggStatus = EggStatus.New;
  public eggLoading = false;
  public EggStadia = EggStatus;
  public eggAnimation = false;

  constructor(private store: Store,
              private authService: AuthService) {

  }

  ngOnInit() {
    this.store.select(selectEggAnimation).subscribe(a => this.eggAnimation = a);
    this.store.select(selectEggLoading).subscribe(l => this.eggLoading = l);
    this.store.select(selectEggStatus).subscribe(s => this.eggStatus = s);
  }

  async openEgg(ev: Event) {
    this.store.dispatch(EggActions.eggAnimation());
    if (!this.authService.isLoggedIn) {
      await this.authService.anonymouslySignin();
    }
    this.store.dispatch(EggActions.openEgg());
  }
}
