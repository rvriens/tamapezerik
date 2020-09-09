import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  health: number;
  hydration: number;
  food: number;
  love: number;
  pezerik: number;

  constructor(
    public modalController: ModalController,
    private characterService: CharacterService,
    private detector: ChangeDetectorRef) { }

  ngOnInit() {
    this.characterService.getCharacter().subscribe( c => {
      this.health = c.stats.health / 100;
      this.hydration = c.stats.hydration / 100;
      this.food = c.stats.food / 100;
      this.love = c.stats.love / 100;
      this.pezerik = c.stats.pezerik / 100;
      setTimeout(() => this.detector.detectChanges(), 10);
    });
  }

  getColor(value: number): string {
    if (value < 0.15) { return 'danger'; }
    if (value < 0.3) { return 'warning'; }
    return 'success';
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
