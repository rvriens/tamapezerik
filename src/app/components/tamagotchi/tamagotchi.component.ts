import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { EggStatus, EggstatusService } from '../../services/eggstatus.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EggService } from 'src/app/services/egg.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.scss']
})
export class TamagotchiComponent implements OnInit {

  public eggStatus: Subject<EggStatus>;
  public EggStadia = EggStatus;

  constructor(private eggStatusService: EggstatusService,
              private eggService: EggService,
              private router: Router,
              private authService: AuthService,
              private detector: ChangeDetectorRef) {
    this.InitStatus();
  }

  ngOnInit() {
  }

  openEgg() {
    sessionStorage.setItem('eggopening', 'true');
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.eggService.openEgg();
  }

  private async InitStatus() {
    this.eggStatus = this.eggStatusService.getEggStatus();
    this.eggStatus.subscribe(e =>
        {
          if (e === EggStatus.New &&
            sessionStorage.getItem('eggopening') === 'true' &&
            this.authService.isLoggedIn) {
              sessionStorage.setItem('eggopening', 'false');
              sessionStorage.removeItem('eggopening');
              this.openEgg();
              return;
          }
          setTimeout(() =>
          this.detector.detectChanges(), 100);
          console.log('status', e);
        }
    );
  }
}
