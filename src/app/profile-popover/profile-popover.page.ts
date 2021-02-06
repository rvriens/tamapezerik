import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import * as AppActions from '../actions/app.actions';
import { selectUser } from '../selectors/app.selectors';
import { Observable } from 'rxjs';
import { User } from '../reducers/app.reducer';
import { selectOwner } from '../selectors/character.selectors';

@Component({
    templateUrl: './profile-popover.page.html'
  })
  export class ProfilePopoverPage implements OnInit {

    public user: Observable<User>;
    public owner: Observable<string>;

    constructor(private popover: PopoverController,
                private router: Router,
                private store: Store,
                private navCtrl: NavController) {}

  ngOnInit(): void {
    this.user = this.store.select(selectUser);
    this.owner = this.store.select(selectOwner);
  }

  close() {
      this.popover.dismiss();
  }

  phoneSignup() {
    this.router.navigate(['/login']);
    this.close();
  }

  logout() {
    this.store.dispatch(AppActions.appLogout());
    this.close();
  }

  info() {
    this.navCtrl.navigateForward('info');
    this.close();
  }

  openCharacters() {
    this.navCtrl.navigateForward('character');
    this.close();
  }

  refresh() {
    window.location.reload();
  }
}
