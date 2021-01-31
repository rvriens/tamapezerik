import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as EggActions from '../../actions/egg.actions';
import { selectEatEgg } from '../../selectors/egg.selectors';

@Component({
  selector: 'app-egg',
  templateUrl: './egg.component.html',
  styleUrls: ['./egg.component.scss'],
})
export class EggComponent implements OnInit {
  @Output() openEgg = new EventEmitter();
  public friedegg = false;
  public friedcharacter: Observable<{name: string, fullname: string}>;
  public openingEgg = false;

  constructor(private alertController: AlertController,
              private store: Store,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.friedcharacter = this.store.select(selectEatEgg);
  }

  open(ev: Event) {
    this.openingEgg = true;
    this.openEgg.emit();
  }

  info() {
    this.navCtrl.navigateForward('info');
  }

  closefriedegg() {
    this.friedegg = false;
  }

  async pan(){

    this.store.dispatch(EggActions.eatEgg());

    const alert = await this.alertController.create({
      cssClass: 'panpopup',
      header: 'Eten?',
      message: 'Heb je echt zo\'n honger dat je het eitje wilt opeten?',
      buttons: [
        {
          text: 'Nee',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Nee');
          }
        }, {
          text: 'Ja',
          handler: () => {
            console.log('Eet');
            this.friedegg = true;
          }
        }
      ]
    });

    await alert.present();
  }

}
