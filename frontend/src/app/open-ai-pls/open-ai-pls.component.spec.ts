import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAIPLSComponent } from './open-ai-pls.component';

describe('OpenAIPLSComponent', () => {
  let component: OpenAIPLSComponent;
  let fixture: ComponentFixture<OpenAIPLSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAIPLSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAIPLSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
