import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSignosPage } from './add-signos.page';

describe('AddSignosPage', () => {
  let component: AddSignosPage;
  let fixture: ComponentFixture<AddSignosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSignosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
