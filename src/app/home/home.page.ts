import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverPage } from '../profile-popover/profile-popover.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public popover: PopoverController) {}

  presentPopover(ev) {
    this.popover.create(
        {
          component: ProfilePopoverPage,
          event: ev,
          showBackdrop: false
        }).then((popoverElement) => {
        popoverElement.present();
      });
  }

}

