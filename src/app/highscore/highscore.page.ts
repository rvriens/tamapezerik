import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HighScore } from '../../../functions/src/models/highscore.model';
import { HighscoreService } from '../services/highscore.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.page.html',
  styleUrls: ['./highscore.page.scss'],
})
export class HighscorePage implements OnInit {

  highScores: HighScore[];
  constructor(private highScoreService: HighscoreService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.loadHighScores();
  }

  async loadHighScores(){
    this.highScores = await this.highScoreService.getHighScores();
    console.log(this.highScores);
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
