import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TamagotchiComponent } from './tamagotchi.component';

describe('TamagotchiComponent', () => {
  let component: TamagotchiComponent;
  let fixture: ComponentFixture<TamagotchiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamagotchiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TamagotchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
