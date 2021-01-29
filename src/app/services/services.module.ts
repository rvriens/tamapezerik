import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EggstatusService } from './eggstatus.service';
import { AuthService } from './auth.service';
import { EggService } from './egg.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule} from '@angular/fire/functions';
import { CharacterService } from './character.service';
import { ItemService } from './item.service';
import { HighscoreService } from './highscore.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    EggstatusService,
    EggService,
    AuthService,
    CharacterService,
    ItemService,
    HighscoreService
  ],
  declarations: []
})
export class ServicesModule { }
