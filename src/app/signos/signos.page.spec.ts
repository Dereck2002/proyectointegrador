import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignosPage } from './signos.page';

describe('SignosPage', () => {
  let component: SignosPage;
  let fixture: ComponentFixture<SignosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
