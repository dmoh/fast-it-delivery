import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvailableOrdersPage } from './available-orders.page';

describe('AvalaibleOrdersPage', () => {
  let component: AvailableOrdersPage;
  let fixture: ComponentFixture<AvailableOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
