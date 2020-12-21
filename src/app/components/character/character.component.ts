import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { EggService } from 'src/app/services/egg.service';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ItemsPage } from '../../items/items.page';
import { StatsPage } from '../../stats/stats.page';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ItemAction } from 'functions/src/models/itemaction.model';
import { promise } from 'protractor';
import { MessagePopoverComponent } from '../messagepopover/messagepopover.component';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {

  fullname: string;
  imgurl: string; // SafeResourceUrl;
  itemUrl: string;
  itemout = false;
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
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.characterService.getCharacter().subscribe( c => {
      if (c) {
        this.fullname = c.fullname;

        const ref = this.fireStorage.ref(`/characters/${c.name}/${c.mood ?? 'neutral'}.png`);
        ref.getDownloadURL().toPromise().then( (url) => {
          this.imgurl = url; // this.sanitizer.bypassSecurityTrustResourceUrl( url);
          setTimeout(() => this.detector.detectChanges(), 10);
        });
      }
    });

    // this.fireMessaging.onMessage()
    /*this.fireMessaging.requestToken
      .subscribe(
        (token) =>
        {
          console.log('Permission granted! Save to the server!', token);
          this.saveToken(token);

        },
        (error) => { console.error(error); },
      );*/
    /*this.fireMessaging.tokenChanges
      .subscribe(
        (token) =>
        {
          console.log('Permission granted! Save to the server!', token);
          this.saveToken(token);

        },
        (error) => { console.error(error); },
      );

    this.fireMessaging.messages
      .subscribe((message) => { console.log(message); });
      */
  }

  /*
  async testMessage() {


    const testMessage = this.fns.httpsCallable('testMessage');
    const item = 'test1';
    const result = await testMessage({item}).toPromise();
    console.log('openegg result', result);

    if (result) {
      //
    }
  }

  async saveToken(token: string): Promise<void> {
    const messagingRef = this.fireStore.collection('messaging').doc(await this.auth.getUserUid());
    messagingRef.set({token});
  }
  */

  async itemsModal() {
    const modal = await this.modalController.create({
      component: ItemsPage,
      cssClass: 'modal-items'
    });
    modal.onDidDismiss<ItemAction>().then ( (data: {data: {success: boolean; animation: string}}) =>
    {
      console.log(data);
      if (data.data?.animation) {
        this.showItemAnimation(data.data?.animation);
      }
    });
    return await modal.present();
  }

  testMessage(e){
    this.messagePopup('Ik heb wel dorst', e);
  }
  async messagePopup(message: string, ev: any) {

    const popover = await this.popoverController.create({
      component: MessagePopoverComponent,
      cssClass: 'message-popover',
      showBackdrop: false,
      event: ev,
      translucent: false,
      componentProps: {message}
    });
    return await popover.present();
  }

  async showItemAnimation(item: string) {
    const ref = this.fireStorage.ref(`/items/${item}.gif`);
    ref.getDownloadURL().toPromise().then( async (url) => {
          this.itemout = false;
          this.itemUrl = url;
          setTimeout(() => this.detector.detectChanges(), 10);
          await new Promise(r => setTimeout(() => r(), 2500));
          this.itemout = true;
          setTimeout(() => this.detector.detectChanges(), 10);
          await new Promise(r => setTimeout(() => r(), 2500));
          this.itemUrl = url;
          setTimeout(() => this.detector.detectChanges(), 10);
        });
  }


  async statsModal() {
    const modal = await this.modalController.create({
      component: StatsPage,
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
