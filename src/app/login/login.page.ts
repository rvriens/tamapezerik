import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  @ViewChild('recaptchacontainer') recaptchacontainer: ElementRef;
  public method: string;
  public tel: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastController: ToastController,
              public authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.method = params.get('method');
      if (this.method === 'email') {
        this.tryEmailLogin();
      }
    });
  }

  async tryEmailLogin() {
    await this.authService.tryMailLinkLogin(window.location.toString());
  }

  async enterTel(phonenr: string | number) {

    if (phonenr.toString().startsWith('06')) {
      phonenr = '+316' + phonenr.toString().substring(2);
    }
    this.authService.loginMobile(phonenr.toString(), this.recaptchacontainer.nativeElement);
  }

  /*async enterEmail(email: string | number) {

    this.authService.emailSignin(email.toString());
    this.router.navigate(['emailsent']);

  }

  async tryLoginGoogle() {
    this.authService.googleSignin();
  }

  async tryLoginFacebook() {
    this.authService.facebookSignin();
  }*/

  async enterCode() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

}
