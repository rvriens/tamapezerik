import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonNav, NavController } from '@ionic/angular';
import { StatsPage } from '../stats/stats.page';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit, AfterViewInit {
  @ViewChild('nav') nav: IonNav;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.nav.setRoot(StatsPage, {nav: this.nav});
  }

}
