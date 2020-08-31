import { Component, OnInit } from '@angular/core';
import { EggStatus, EggstatusService } from '../../services/eggstatus.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tamagotchi',
  templateUrl: './tamagotchi.component.html',
  styleUrls: ['./tamagotchi.component.scss'],
})
export class TamagotchiComponent implements OnInit {

  public eggStatus: EggStatus;
  public EggStadia = EggStatus;

  constructor(private eggStatusService: EggstatusService,
              private authService: AuthService) {
    this.InitStatus();
  }

  ngOnInit() {}

  openEgg() {
    console.log('open');
  }

  private async InitStatus() {
    this.eggStatus = await this.eggStatusService.getEggStatus();
  }
}
