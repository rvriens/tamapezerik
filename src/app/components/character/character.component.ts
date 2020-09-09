import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { EggService } from 'src/app/services/egg.service';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, AlertController } from '@ionic/angular';
import { ItemsPage } from '../../items/items.page';
import { StatsPage } from '../../stats/stats.page';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {

  fullname: string;
  imgurl: string; // SafeResourceUrl;
  constructor(
    private characterService: CharacterService,
    private eggService: EggService,
    private detector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.characterService.getCharacter().subscribe( c => {
      if (c) {
        this.imgurl = `/assets/characters/${c.name}.png`;
        setTimeout(() => this.detector.detectChanges(), 10);
      }
    });
  }

  async itemsModal() {
    const modal = await this.modalController.create({
      component: ItemsPage
    });
    return await modal.present();
  }

  async statsModal() {
    const modal = await this.modalController.create({
      component: StatsPage
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
