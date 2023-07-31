import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAIQnAComponent } from './open-ai-qn-a.component';

describe('OpenAIQnAComponent', () => {
  let component: OpenAIQnAComponent;
  let fixture: ComponentFixture<OpenAIQnAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAIQnAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAIQnAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
