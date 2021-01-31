import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import * as AppActions from '../actions/app.actions';
import { selectUser } from '../selectors/app.selectors';
import { Observable } from 'rxjs';
import { User } from '../reducers/app.reducer';

@Component({
    templateUrl: './profile-popover.page.html'
  })
  export class ProfilePopoverPage implements OnInit {

    public user: Observable<User>;

    constructor(private popover: PopoverController,
                private router: Router,
                private store: Store,
                private navCtrl: NavController) {}

  ngOnInit(): void {
    this.user = this.store.select(selectUser);
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
}
