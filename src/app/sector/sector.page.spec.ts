import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SectorPage } from './sector.page';

describe('SectorPage', () => {
  let component: SectorPage;
  let fixture: ComponentFixture<SectorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
    }).compileComponents();

    fixture = TestBed.createComponent(SectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
