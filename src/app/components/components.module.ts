import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CharacterComponent } from './character/character.component';
import { TamagotchiComponent } from './tamagotchi/tamagotchi.component';
import { EggComponent } from './egg/egg.component';
import { ServicesModule } from '../services/services.module';
import { IntroComponent } from './intro/intro.component';
import { DeadComponent } from './dead/dead.component';
import { MessagePopoverComponent } from './messagepopover/messagepopover.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ServicesModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
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
