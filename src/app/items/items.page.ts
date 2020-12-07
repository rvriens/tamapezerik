import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Item } from 'functions/src/models/item.model';
import { Observable } from 'rxjs';
import { CharacterService } from '../services/character.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  public items: Observable<Item[]>;

  constructor(public modalController: ModalController,
              private characterService: CharacterService,
              private itemService: ItemService) { }

  ngOnInit() {
    this.items = this.itemService.getItems();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async give(item: string) {
    const itemAction = await this.characterService.giveItem(item);
    this.modalController.dismiss(itemAction);
  }
}
