import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Character } from 'functions/src/models/character.model';
import { HighScore } from 'functions/src/models/highscore.model';
import { selectOwner } from '../selectors/character.selectors';
import { CharacterService } from '../services/character.service';
import { HighscoreService } from '../services/highscore.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.scss'],
})
export class CharacterPage implements OnInit {

  owner: string;
  userUid: string;
  highScores: HighScore[];
  character: Character;

  public messageForm: FormGroup;
  public sendingMessageLoading = false;
  public pointsForm: FormGroup;
  public sendingPointsLoading = false;

  health: number;
  hydration: number;
  food: number;
  love: number;
  pezerik: number;

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              public platform: Platform,
              private highScoreService: HighscoreService,
              private fb: FormBuilder,
              private db: AngularFireDatabase,
              private fns: AngularFireFunctions) { }

  ngOnInit() {

    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
    });
    this.pointsForm = this.fb.group({
      points: ['', [Validators.required, Validators.min(-10), Validators.max(10)]]
    });

    this.route.paramMap.subscribe(pm => {
        this.userUid = pm.get('id');
        this.db.database.ref(`users/${this.userUid}/character`).on('value', (snapshot) => {
           this.character = snapshot.val();
           const c = this.character;
           this.health = c.stats.health / 100;
           this.hydration = c.stats.hydration / 100;
           this.food = c.stats.food / 100;
           this.love = c.stats.love / 100;
           this.pezerik = c.stats.pezerik / 100;
        });
      }
    );

    this.store.select(selectOwner).subscribe(
      name =>  {
        if (!name) {
          this.router.navigate(['/']);
          return;
        }
        this.loadOwner(name);
      }
    );
  }

  close() {
    this.navCtrl.navigateRoot('home');
  }

  async loadOwner(name: string): Promise<void> {
    this.owner = name;
    this.highScores = await this.highScoreService.getOwnerNames(this.owner);
  }

  async sendMessage() {
    if (this.messageForm.valid) {
      const message = this.messageForm.value.message;
      this.sendingMessageLoading = true;
      try {
      const ownerMessage = this.fns.httpsCallable('ownerMessage');
      const result = await ownerMessage({uid: this.userUid, message}).toPromise();
      if (result) {
         this.messageForm.reset();
      }
      } catch {}
      this.sendingMessageLoading = false;
    }
  }

  async sendPoints() {
    if (this.pointsForm.valid) {
      const points = this.pointsForm.value.points;
      this.sendingPointsLoading = true;
      try {
      const ownerPoints = this.fns.httpsCallable('ownerPoints');
      const result = await ownerPoints({uid: this.userUid, points}).toPromise();
      if (result) {
         this.pointsForm.reset();
      }
      } catch {}
      this.sendingPointsLoading = false;
    }
  }

  getColor(value: number): string {
    if (value < 0.15) { return 'danger'; }
    if (value < 0.3) { return 'warning'; }
    return 'success';
  }
}
