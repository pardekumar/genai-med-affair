import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAIHomeComponent } from './open-ai-home.component';

describe('OpenAIHomeComponent', () => {
  let component: OpenAIHomeComponent;
  let fixture: ComponentFixture<OpenAIHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAIHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAIHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
