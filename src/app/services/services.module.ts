import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EggstatusService } from './eggstatus.service';
import { AuthService } from './auth.service';
import { EggService } from './egg.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [EggstatusService, EggService, AuthService],
  declarations: []
})
export class ServicesModule { }
