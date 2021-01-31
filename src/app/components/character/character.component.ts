import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { EggService } from '../../services/egg.service';
import { ItemsPage } from '../../items/items.page';
import { StatsPage } from '../../stats/stats.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { ItemAction } from 'functions/src/models/itemaction.model';
import { selectMessage, selectHours, selectPoints } from '../../selectors/character.selectors';
import * as CharacterActions from '../../actions/character.actions';
import { tap } from 'rxjs/operators';
import { HighscorePage } from 'src/app/highscore/highscore.page';
import { ChartsPage } from 'src/app/charts/charts.page';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {
  fullname: string;
  alias: string;
  showmessagein = false;
  showmessageout = false;
  message: Observable<{text: string, type: number}>;
  points: Observable<number>;
  hours: Observable<number>;
  imgurl: string;
  itemUrl: string;
  itemout = false;
  thumburl: string;
  itemurls: {[item: string]: string} = {};

  constructor(
    private characterService: CharacterService,
    private fireStorage: AngularFireStorage,
    private fireMessaging: AngularFireMessaging,
    private fireStore: AngularFirestore,
    private auth: AuthService,
    private eggService: EggService,
    private detector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    public modalController: ModalController,
    private fns: AngularFireFunctions,
    public popoverController: PopoverController,
    public store: Store
  ) { }

  ngOnInit() {

    this.message = this.store.select(selectMessage);
    this.points = this.store.select(selectPoints).pipe(tap(q => console.log('points', q)));
    this.hours = this.store.select(selectHours);

    this.characterService.getCharacter().subscribe( c => {
      if (c) {
        this.fullname = c.fullname;
        this.alias = c.alias ?? this.fullname;

        const ref = this.fireStorage.ref(`/characters/${c.name}/${c.mood ?? 'neutral'}.png`);
        ref.getDownloadURL().toPromise().then( (url) => {
          this.imgurl = url;
          setTimeout(() => this.detector.detectChanges(), 10);
        });
      }
    });
  }

  async itemsModal() {
    const modal = await this.modalController.create({
      component: ItemsPage,
      cssClass: 'modal-items'
    });
    modal.onDidDismiss<ItemAction>().then ( (data: {data: {success: boolean; message: string; animation: string}}) =>
    {
      console.log(data);
      if (data.data.message) {
        this.store.dispatch(CharacterActions.newMessage({message: data.data.message, messagetype: 2}));
      } else {
        this.store.dispatch(CharacterActions.readMessage());
      }
      if (data.data?.animation) {
        this.showItemAnimation(data.data?.animation);
      }
    });
    return await modal.present();
  }

  closeMessage() {
    this.store.dispatch(CharacterActions.readMessage());
  }

  randomMessage(): void {
    this.store.dispatch(CharacterActions.randomMessage());
  }

  async showItemAnimation(item: string) {
    if (!this.itemurls[item]) {
    try {
      const ref = this.fireStorage.ref(`/items/${item}.gif`);
      this.itemurls[item] = (await ref.getDownloadURL().toPromise());
      } catch (e) {
        if (!this.thumburl) {
          const thumbRef = this.fireStorage.ref(`/items/thumb.png`);
          this.thumburl = await thumbRef.getDownloadURL().toPromise();
        }
        this.itemurls[item] = this.thumburl;
      }
    }
    this.loadItemUrl(this.itemurls[item]);
  }

  async loadItemUrl(url: string) {
    this.itemout = false;
    this.itemUrl = url;
    setTimeout(() => this.detector.detectChanges(), 10);
    await new Promise<void>(r => setTimeout(() => r(), 2500));
    this.itemout = true;
    setTimeout(() => this.detector.detectChanges(), 10);
    await new Promise<void>(r => setTimeout(() => r(), 2500));
    this.itemUrl = url;
    setTimeout(() => this.detector.detectChanges(), 10);
  }


  async statsModal() {
    const modal = await this.modalController.create({
      component: ChartsPage, // HighscorePage, // StatsPage,
      cssClass: 'modal-items'
    });
    return await modal.present();
  }

  async killEgg() {
    const alert = await this.alertController.create({
      header: 'Verwijderen',
      message: 'Weet je het zeker?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.eggService.killEgg();
          }
        }
      ]
    });
    await alert.present();
  }



}
