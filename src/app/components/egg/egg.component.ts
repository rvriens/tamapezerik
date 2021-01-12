import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  constructor(private alertController: AlertController, private store: Store) { }

  ngOnInit() {
    this.friedcharacter = this.store.select(selectEatEgg);
  }

  open(ev: Event) {
    this.openEgg.emit();
  }

  info() {
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
