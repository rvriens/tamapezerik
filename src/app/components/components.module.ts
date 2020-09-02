import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CharacterComponent } from './character/character.component';
import { TamagotchiComponent } from './tamagotchi/tamagotchi.component';
import { EggComponent } from './egg/egg.component';
import { ServicesModule } from '../services/services.module';
import { IntroComponent } from './intro/intro.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ServicesModule,
    RouterModule
  ],
  exports: [TamagotchiComponent],
  declarations: [
    CharacterComponent,
    TamagotchiComponent,
    EggComponent,
    IntroComponent]
})
export class ComponentsModule { }
