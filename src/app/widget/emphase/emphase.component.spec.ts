import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmphaseComponent } from './emphase.component';

describe('EmphaseComponent', () => {
  let component: EmphaseComponent;
  let fixture: ComponentFixture<EmphaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmphaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmphaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
