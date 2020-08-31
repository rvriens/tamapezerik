import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EggComponent } from './egg.component';

describe('EggComponent', () => {
  let component: EggComponent;
  let fixture: ComponentFixture<EggComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
