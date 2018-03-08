import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageBoxComponent } from './chat-message-box.component';

describe('ChatMessageBoxComponent', () => {
  let component: ChatMessageBoxComponent;
  let fixture: ComponentFixture<ChatMessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
