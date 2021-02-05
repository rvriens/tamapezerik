import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private navCtrl: NavController,
              public platform: Platform) { }

  ngOnInit() {
  }

  close() {
    this.navCtrl.navigateRoot('home');
  }
}
