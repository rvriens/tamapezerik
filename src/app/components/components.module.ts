import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CharacterComponent } from './character/character.component';
import { TamagotchiComponent } from './tamagotchi/tamagotchi.component';
import { EggComponent } from './egg/egg.component';
import { ServicesModule } from '../services/services.module';

@NgModule({
  imports: [
    CommonModule, IonicModule, ServicesModule
  ],
  exports: [TamagotchiComponent],
  declarations: [CharacterComponent, TamagotchiComponent, EggComponent]
})
export class ComponentsModule { }
