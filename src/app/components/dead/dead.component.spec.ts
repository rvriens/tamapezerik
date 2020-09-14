import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeadComponent } from './dead.component';

describe('DeadComponent', () => {
  let component: DeadComponent;
  let fixture: ComponentFixture<DeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});