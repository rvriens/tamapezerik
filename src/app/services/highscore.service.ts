import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { HighScore } from 'functions/src/models/highscore.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {

  constructor(
    private db: AngularFireDatabase,
    private fs: AngularFirestore,
    private fns: AngularFireFunctions,
    private auth: AuthService) { }

    async getHighScores(points: number = null): Promise<HighScore[]> {

      let highscoreQuery =  await this.fs
                         .collection<HighScore>('highscore')
                         .ref
                         .orderBy('points', 'desc')
                         .limit(10);
      if (points) {
        highscoreQuery = highscoreQuery.startAt(points);
      }
      const highscoreQuerySnapshot = await highscoreQuery.get();
      return highscoreQuerySnapshot.docs.map(q =>
        {
          const highscore = q.data();
          highscore.id = q.id;
          return highscore;
        }
      );
    }
}
