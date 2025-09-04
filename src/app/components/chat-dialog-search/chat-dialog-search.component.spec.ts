import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDialogSearchComponent } from './chat-dialog-search.component';

describe('ChatDialogSearchComponent', () => {
  let component: ChatDialogSearchComponent;
  let fixture: ComponentFixture<ChatDialogSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatDialogSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDialogSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
