import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CharacterComponent } from './character/character.component';
import { TamagotchiComponent } from './tamagotchi/tamagotchi.component';
import { EggComponent } from './egg/egg.component';
import { ServicesModule } from '../services/services.module';
import { IntroComponent } from './intro/intro.component';
import { DeadComponent } from './dead/dead.component';
import { MessagePopoverComponent } from './messagepopover/messagepopover.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ServicesModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [TamagotchiComponent],
  declarations: [
    CharacterComponent,
    TamagotchiComponent,
    EggComponent,
    IntroComponent,
    DeadComponent,
    MessagePopoverComponent]
})
export class ComponentsModule { }
