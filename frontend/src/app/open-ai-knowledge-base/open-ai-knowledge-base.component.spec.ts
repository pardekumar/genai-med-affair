import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAIKnowledgeBaseComponent } from './open-ai-knowledge-base.component';

describe('OpenAIKnowledgeBaseComponent', () => {
  let component: OpenAIKnowledgeBaseComponent;
  let fixture: ComponentFixture<OpenAIKnowledgeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAIKnowledgeBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAIKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
