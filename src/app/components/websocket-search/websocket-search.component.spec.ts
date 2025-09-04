import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketSearchComponent } from './websocket-search.component';

describe('WebsocketSearchComponent', () => {
  let component: WebsocketSearchComponent;
  let fixture: ComponentFixture<WebsocketSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsocketSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsocketSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
