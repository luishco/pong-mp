import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListRoomsPage } from './list-rooms.page';

describe('ListRoomsPage', () => {
  let component: ListRoomsPage;
  let fixture: ComponentFixture<ListRoomsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoomsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListRoomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
