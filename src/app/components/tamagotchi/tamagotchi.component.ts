import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EggService } from '../../services/egg.service';
import { Store } from '@ngrx/store';
import { selectEggStatus, selectEggLoading } from '../../selectors/egg.selectors';
import { EggStatus } from '../../reducers/egg.reducer';
import * as EggActions from '../../actions/egg.actions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.scss']
})
export class TamagotchiComponent implements OnInit {

  public eggStatus: Observable<EggStatus>;
  public eggLoading: Observable<boolean>;
  public EggStadia = EggStatus;

  constructor(private store: Store,
              private eggService: EggService,
              private router: Router,
              private authService: AuthService,
              private detector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.eggLoading = this.store.select(selectEggLoading);
    this.eggStatus = this.store.select(selectEggStatus).pipe(tap(s => {
      console.log('egg-status', s);
      if (s === EggStatus.New &&
        sessionStorage.getItem('eggopening') === 'true' &&
        this.authService.isLoggedIn) {
          sessionStorage.setItem('eggopening', 'false');
          sessionStorage.removeItem('eggopening');
          this.openEgg(null);
          return;
      }
    }));

  }

  openEgg(ev: Event) {
    sessionStorage.setItem('eggopening', 'true');
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    // this.eggService.openEgg();
    this.store.dispatch(EggActions.openEgg());
  }

  // private async InitStatus() {
  //   this.eggStatus = this.eggStatusService.getEggStatus();
  //   this.eggStatus.subscribe(e =>
  //       {
  //         if (e === EggStatus.New &&
  //           sessionStorage.getItem('eggopening') === 'true' &&
  //           this.authService.isLoggedIn) {
  //             sessionStorage.setItem('eggopening', 'false');
  //             sessionStorage.removeItem('eggopening');
  //             this.openEgg(null);
  //             return;
  //         }
  //         setTimeout(() =>
  //         this.detector.detectChanges(), 100);
  //         console.log('status', e);
  //       }
  //   );
  // }
}
