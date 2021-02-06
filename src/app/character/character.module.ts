import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterPageRoutingModule } from './character-routing.module';

import { CharacterPage } from './character.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [CharacterPage]
})
export class CharacterPageModule {}
