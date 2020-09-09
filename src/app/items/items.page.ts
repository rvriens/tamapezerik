import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  constructor(public modalController: ModalController,
              private characterService: CharacterService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  give(item: string) {
    this.characterService.giveItem(item);
  }
}
